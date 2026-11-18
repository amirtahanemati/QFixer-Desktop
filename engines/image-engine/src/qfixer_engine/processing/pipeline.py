"""Orchestrated processing pipeline for QFixer image enhancement."""

import cv2
import numpy as np
from typing import Dict, Any, Optional

from qfixer_engine.processing.shadow_removal import remove_shadows
from qfixer_engine.processing.noise_removal import remove_noise
from qfixer_engine.processing.lighting import adjust_brightness_contrast, apply_clahe
from qfixer_engine.processing.sharpening import sharpen_image
from qfixer_engine.protection.protection_mask import create_protection_masks, apply_protected_blend


def execute_pipeline(
    image: np.ndarray,
    options: Dict[str, Any],
    protection_mask: Optional[np.ndarray] = None,
) -> np.ndarray:
    """Executes full classical scientific enhancement pipeline in non-destructive order:

    1. Generate multi-layer protection masks if requested
    2. Illumination / Shadow Correction (with protection mask)
    3. Edge-Preserving Noise & Stain Reduction
    4. Brightness & Contrast Adjustment
    5. Controlled Edge Sharpening
    6. Protected Blend back to safeguard critical ink
    """
    result = image.copy()

    # Automatically generate protection masks if protection options are enabled
    protect_text = options.get("protect_text", True)
    protect_formulas = options.get("protect_formulas", True)
    protect_diagrams = options.get("protect_diagrams", True)

    if protection_mask is None and (protect_text or protect_formulas or protect_diagrams):
        masks = create_protection_masks(
            image,
            preserve_fine_lines=protect_diagrams,
            preserve_formulas=protect_formulas,
            preserve_text=protect_text,
        )
        protection_mask = masks["combined"]

    # 1. Shadow Removal
    shadow_strength = options.get("shadow_removal", 50) / 100.0
    if shadow_strength > 0:
        result = remove_shadows(
            result,
            strength=shadow_strength,
            protection_mask=protection_mask if protect_text else None,
        )

    # 2. Noise Removal
    noise_strength = options.get("noise_removal", 30) / 100.0
    if noise_strength > 0:
        result = remove_noise(
            result,
            strength=noise_strength,
            protection_mask=protection_mask if protect_formulas else None,
        )

    # 3. Brightness & Contrast
    brightness = options.get("brightness", 0)
    contrast = options.get("contrast", 0)
    if brightness != 0 or contrast != 0:
        result = adjust_brightness_contrast(result, brightness=brightness, contrast=contrast)

    # 4. Sharpening
    sharpen_strength = options.get("sharpening", 20) / 100.0
    if sharpen_strength > 0:
        result = sharpen_image(
            result,
            strength=sharpen_strength,
            protection_mask=protection_mask if protect_diagrams else None,
        )

    # Final blend step: guarantee intact original ink
    if protection_mask is not None and (protect_text or protect_formulas or protect_diagrams):
        result = apply_protected_blend(image, result, protection_mask)

    return result
