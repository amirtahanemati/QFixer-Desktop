"""Multi-layer scientific protection mask generator.

Prevents destructive image filtering operations (denoising, background suppression,
thresholding) from eroding mathematical notation, thin geometric lines, diacritics,
radicals, and small subscript/superscript characters.
"""

import cv2
import numpy as np
from typing import Dict, Tuple


def create_protection_masks(
    image: np.ndarray,
    preserve_fine_lines: bool = True,
    preserve_formulas: bool = True,
    preserve_text: bool = True,
) -> Dict[str, np.ndarray]:
    """Generates independent and combined binary protection masks.

    Args:
        image: BGR or Grayscale uint8 image.
        preserve_fine_lines: Whether to protect thin diagram lines and axes.
        preserve_formulas: Whether to protect mathematical fraction bars and symbols.
        preserve_text: Whether to protect text characters.

    Returns:
        Dict containing individual masks ('text', 'formulas', 'diagrams')
        and the unified 'combined' uint8 binary mask (255 = protected ink, 0 = background).
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()

    h, w = gray.shape

    # 1. High-frequency edge detection for thin strokes (Canny & Sobel)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    edges = cv2.Canny(blurred, 50, 150)

    # 2. Adaptive ink thresholding
    binary_ink = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        21,
        12,
    )

    # Initialize layer masks
    text_mask = np.zeros((h, w), dtype=np.uint8)
    formula_mask = np.zeros((h, w), dtype=np.uint8)
    diagram_mask = np.zeros((h, w), dtype=np.uint8)

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(binary_ink, connectivity=8)

    for i in range(1, num_labels):
        comp_w = stats[i, cv2.CC_STAT_WIDTH]
        comp_h = stats[i, cv2.CC_STAT_HEIGHT]
        area = stats[i, cv2.CC_STAT_AREA]

        # Ignore tiny isolated single-pixel dust
        if area <= 3:
            continue

        aspect_ratio = float(comp_w) / max(comp_h, 1)
        component_pixels = (labels == i)

        # Classification into mask layers
        if (comp_w > w * 0.20 or comp_h > h * 0.20) or (area > 500 and aspect_ratio > 3.5):
            diagram_mask[component_pixels] = 255
        elif (aspect_ratio > 2.5 and comp_h <= 8 and comp_w >= 10) or (aspect_ratio < 0.4 and comp_h >= 15):
            formula_mask[component_pixels] = 255
        else:
            text_mask[component_pixels] = 255

    # Include edge boundaries in diagram mask to guard smooth curves
    if preserve_fine_lines:
        diagram_mask = cv2.bitwise_or(diagram_mask, edges)

    # Build the combined unified protection mask
    combined = np.zeros((h, w), dtype=np.uint8)

    if preserve_text:
        combined = cv2.bitwise_or(combined, text_mask)
    if preserve_formulas:
        combined = cv2.bitwise_or(combined, formula_mask)
    if preserve_fine_lines:
        combined = cv2.bitwise_or(combined, diagram_mask)

    # Controlled single-pixel dilation to create safety halo around delicate ink
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    safety_halo = cv2.dilate(combined, kernel, iterations=1)

    return {
        "text": text_mask,
        "formulas": formula_mask,
        "diagrams": diagram_mask,
        "combined": safety_halo,
        "raw_ink": combined,
    }


def apply_protected_blend(
    original_image: np.ndarray,
    processed_image: np.ndarray,
    protection_mask: np.ndarray,
) -> np.ndarray:
    """Blends processed image with original, strictly preserving protected ink regions.

    Args:
        original_image: Original input image before aggressive filtering.
        processed_image: Cleaned/filtered image candidate.
        protection_mask: Binary mask where 255 indicates protected content.

    Returns:
        Image with cleaned background and intact original scientific ink.
    """
    if len(original_image.shape) == 3 and len(protection_mask.shape) == 2:
        mask_3ch = cv2.merge([protection_mask, protection_mask, protection_mask])
    else:
        mask_3ch = protection_mask

    norm_mask = (mask_3ch.astype(np.float32) / 255.0)

    # In protected ink areas: retain original dark details and sharpness.
    # In background: adopt the cleaned and normalized processed image.
    blended = (
        original_image.astype(np.float32) * norm_mask
        + processed_image.astype(np.float32) * (1.0 - norm_mask)
    )

    return np.clip(blended, 0, 255).astype(np.uint8)
