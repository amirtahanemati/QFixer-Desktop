"""Lighting, exposure, white balance and contrast enhancement."""

import cv2
import numpy as np


def adjust_brightness_contrast(
    image: np.ndarray,
    brightness: int = 0,  # -100 to 100
    contrast: int = 0,    # -100 to 100
) -> np.ndarray:
    """Adjusts overall brightness and contrast using linear transformation."""
    if brightness == 0 and contrast == 0:
        return image.copy()

    # Alpha is contrast [0.0 to 3.0], Beta is brightness [-100 to 100]
    alpha = float(131 * (contrast + 127)) / (127 * (131 - contrast)) if contrast != 131 else 1.0
    alpha = max(0.0, min(3.0, alpha))
    beta = float(brightness)

    adjusted = cv2.convertScaleAbs(image, alpha=alpha, beta=beta)
    return adjusted


def apply_clahe(image: np.ndarray, clip_limit: float = 2.0, tile_grid_size: int = 8) -> np.ndarray:
    """Applies Contrast Limited Adaptive Histogram Equalization (CLAHE)."""
    is_color = len(image.shape) == 3 and image.shape[2] == 3
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(tile_grid_size, tile_grid_size))

    if is_color:
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        l_enhanced = clahe.apply(l)
        merged = cv2.merge([l_enhanced, a, b])
        return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)
    else:
        return clahe.apply(image)
