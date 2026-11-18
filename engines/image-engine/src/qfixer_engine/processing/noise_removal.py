"""Edge-preserving noise, spot, and scan artifact removal."""

import cv2
import numpy as np


def remove_noise(
    image: np.ndarray,
    strength: float = 0.5,
    protection_mask: np.ndarray = None,
) -> np.ndarray:
    """Removes high-frequency grain, scanner artifacts, and dust spots while preserving fine diagram lines and text edges."""
    if strength <= 0.01:
        return image.copy()

    # Calculate bilateral filter parameters based on strength
    d = 7
    sigma_color = int(25 + strength * 50)
    sigma_space = int(25 + strength * 50)

    # Apply bilateral filter which smooths flat regions while preserving sharp step edges
    denoised = cv2.bilateralFilter(image, d, sigma_color, sigma_space)

    # If protection mask provided, retain original exact pixels in protected zones
    if protection_mask is not None:
        if len(image.shape) == 3 and len(protection_mask.shape) == 2:
            mask_3c = cv2.merge([protection_mask, protection_mask, protection_mask])
        else:
            mask_3c = protection_mask

        is_protected = (mask_3c > 127)
        denoised = np.where(is_protected, image, denoised)

    return denoised
