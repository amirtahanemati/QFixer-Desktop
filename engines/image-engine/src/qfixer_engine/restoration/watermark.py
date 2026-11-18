"""Watermark and Stamp Removal Module for Educational Documents.

Detects semi-transparent watermarks, background branding, and stamps by analyzing
chroma/luminance distributions, and performs inpainting while preserving primary dark ink.
"""

import cv2
import numpy as np
from typing import Tuple
from qfixer_engine.restoration.inpainting import inpaint_region


def detect_watermark_mask(
    image: np.ndarray,
    sensitivity: float = 0.5,
    preserve_dark_ink_threshold: int = 110,
) -> np.ndarray:
    """Detects semi-transparent watermarks and light colored logos.

    Args:
        image: BGR uint8 image.
        sensitivity: Detection sensitivity factor (0.0 to 1.0).
        preserve_dark_ink_threshold: Grayscale values below this are guaranteed
                                     to be preserved as original question ink.

    Returns:
        Binary mask (uint8) marking detected watermark regions (255 = watermark).
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        saturation = hsv[:, :, 1]
    else:
        gray = image.copy()
        saturation = np.zeros_like(gray)

    # 1. Dark ink mask: Question text, formulas, diagrams (must NEVER be touched)
    _, dark_ink_mask = cv2.threshold(gray, preserve_dark_ink_threshold, 255, cv2.THRESH_BINARY_INV)

    # 2. Estimate paper white background
    background_val = np.percentile(gray, 95)

    # 3. Watermark candidates: Mid-tone luminance (between dark ink and bright paper)
    # Sensitivity adjusts the low threshold
    lower_bound = int(preserve_dark_ink_threshold + (1.0 - sensitivity) * 40)
    upper_bound = int(background_val - 15)

    watermark_cand = cv2.inRange(gray, lower_bound, upper_bound)

    # Also detect faint colored stamps/logos via saturation channel
    colored_stamp_cand = cv2.inRange(saturation, 35, 255)
    combined_cand = cv2.bitwise_or(watermark_cand, colored_stamp_cand)

    # Strictly exclude any dark scientific ink
    safe_watermark_mask = cv2.bitwise_and(combined_cand, cv2.bitwise_not(dark_ink_mask))

    # Morphological clean up to remove random tiny dots
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    cleaned_mask = cv2.morphologyEx(safe_watermark_mask, cv2.MORPH_OPEN, kernel)

    return cleaned_mask


def remove_watermark(
    image: np.ndarray,
    sensitivity: float = 0.5,
    method: str = "telea",
) -> Tuple[np.ndarray, np.ndarray]:
    """Detects and removes watermark, returning restored image and the generated mask.

    Args:
        image: BGR uint8 image.
        sensitivity: Watermark detection sensitivity.
        method: Inpainting method ('telea', 'ns', 'paper_texture').

    Returns:
        Tuple of (restored_image, watermark_mask).
    """
    mask = detect_watermark_mask(image, sensitivity=sensitivity)
    restored = inpaint_region(image, mask, method=method, radius=2)
    return restored, mask
