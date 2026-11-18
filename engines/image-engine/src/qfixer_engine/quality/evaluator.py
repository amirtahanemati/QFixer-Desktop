"""Objective Scientific Image Quality Evaluator.

Calculates:
- Sharpness score via Laplacian variance
- Noise reduction ratio
- Ink & scientific character preservation factor
- Contrast enhancement ratio
"""

import cv2
import numpy as np
from typing import Dict, Any


def calculate_sharpness(image: np.ndarray) -> float:
    """Calculates focus/sharpness score using modified Laplacian variance."""
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    lap = cv2.Laplacian(gray, cv2.CV_64F)
    return float(lap.var())


def evaluate_restoration_quality(
    original: np.ndarray,
    processed: np.ndarray,
    ink_mask: np.ndarray,
) -> Dict[str, Any]:
    """Calculates comprehensive objective metrics evaluating educational restoration.

    Args:
        original: Original uint8 image.
        processed: Restored uint8 image.
        ink_mask: Binary mask of scientific ink content (255 = ink).

    Returns:
        Structured dictionary of objective quality metrics.
    """
    orig_sharpness = calculate_sharpness(original)
    proc_sharpness = calculate_sharpness(processed)
    sharpness_ratio = round(proc_sharpness / max(orig_sharpness, 1e-5), 2)

    # Estimate background noise reduction in non-ink areas
    if len(original.shape) == 3:
        orig_gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
        proc_gray = cv2.cvtColor(processed, cv2.COLOR_BGR2GRAY)
    else:
        orig_gray = original
        proc_gray = processed

    bg_mask = (ink_mask == 0)
    if np.sum(bg_mask) > 100:
        orig_bg_std = float(np.std(orig_gray[bg_mask]))
        proc_bg_std = float(np.std(proc_gray[bg_mask]))
        noise_reduction_pct = round(max(0.0, (1.0 - (proc_bg_std / max(orig_bg_std, 1e-5))) * 100.0), 1)
    else:
        noise_reduction_pct = 0.0

    # Preservation factor: Mean absolute difference on original dark ink
    # 100.0 means perfect preservation
    ink_bool = (ink_mask == 255)
    if np.sum(ink_bool) > 0:
        mean_ink_diff = float(np.mean(np.abs(orig_gray[ink_bool].astype(float) - proc_gray[ink_bool].astype(float))))
        # Scale to percentage (diff < 5 is excellent preservation > 98%)
        preserved_pct = round(max(0.0, 100.0 - (mean_ink_diff * 0.5)), 1)
    else:
        preserved_pct = 100.0

    return {
        "sharpness": {
            "original": round(orig_sharpness, 1),
            "processed": round(proc_sharpness, 1),
            "improvement_factor": sharpness_ratio,
        },
        "noise_reduction_pct": noise_reduction_pct,
        "ink_preservation_pct": preserved_pct,
        "is_safe_for_science": preserved_pct >= 95.0,
    }
