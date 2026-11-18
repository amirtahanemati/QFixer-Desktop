"""Shadow and uneven illumination removal algorithms for educational documents."""

import cv2
import numpy as np


def estimate_background(gray_image: np.ndarray, kernel_size: int = 51) -> np.ndarray:
    """Estimates the uneven background illumination using morphological dilation/closing."""
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_size, kernel_size))
    # Morphological dilation followed by median blur to estimate background intensity
    dilated = cv2.dilate(gray_image, kernel)
    background = cv2.medianBlur(dilated, 21)
    return background


def remove_shadows(
    image: np.ndarray,
    strength: float = 0.6,
    kernel_size: int = 51,
    protection_mask: np.ndarray = None,
) -> np.ndarray:
    """Removes shadow gradients and uneven lighting while strictly preserving dark ink and text strokes.

    strength: 0.0 (no effect) to 1.0 (full background normalization).
    protection_mask: optional binary mask (255 = protected region, 0 = background to clean).
    """
    is_color = len(image.shape) == 3 and image.shape[2] == 3

    if is_color:
        # Work in LAB color space to adjust Lightness channel only, preserving chromaticity
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l_channel, a_channel, b_channel = cv2.split(lab)
        gray = l_channel
    else:
        gray = image.copy()

    # 1. Estimate background illumination
    bg = estimate_background(gray, kernel_size)

    # 2. Divide foreground by background to normalize illumination
    # normalized = (gray / bg) * 255
    bg_float = bg.astype(np.float32) + 1.0  # avoid zero division
    norm_float = (gray.astype(np.float32) / bg_float) * 255.0
    normalized = np.clip(norm_float, 0, 255).astype(np.uint8)

    # 3. Blend normalized result with original based on strength
    cleaned_gray = cv2.addWeighted(normalized, strength, gray, 1.0 - strength, 0)

    # 4. If protection mask provided, restore protected pixels completely
    if protection_mask is not None:
        mask_binary = (protection_mask > 127).astype(np.uint8)
        cleaned_gray = np.where(mask_binary == 1, gray, cleaned_gray)

    if is_color:
        merged_lab = cv2.merge([cleaned_gray, a_channel, b_channel])
        result = cv2.cvtColor(merged_lab, cv2.COLOR_LAB2BGR)
    else:
        result = cleaned_gray

    return result
