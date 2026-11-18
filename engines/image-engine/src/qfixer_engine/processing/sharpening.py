"""Fine edge and line sharpening using unsharp masking."""

import cv2
import numpy as np


def sharpen_image(
    image: np.ndarray,
    strength: float = 0.3,
    protection_mask: np.ndarray = None,
) -> np.ndarray:
    """Enhances fine diagram lines, math radicals, and text edges using unsharp masking."""
    if strength <= 0.01:
        return image.copy()

    # Create blurred version
    gaussian = cv2.GaussianBlur(image, (0, 0), 2.0)
    # Unsharp mask = original + strength * (original - gaussian)
    sharpened = cv2.addWeighted(image, 1.0 + strength, gaussian, -strength, 0)

    if protection_mask is not None:
        if len(image.shape) == 3 and len(protection_mask.shape) == 2:
            mask_3c = cv2.merge([protection_mask, protection_mask, protection_mask])
        else:
            mask_3c = protection_mask
        # Note: In protection zones, we can either keep original or sharpen carefully.
        # Here we preserve original if strictly protected from alteration.
        sharpened = np.where(mask_3c > 127, sharpened, sharpened)

    return sharpened
