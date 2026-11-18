"""Non-destructive Inpainting and Area Restoration Module.

Supports:
- Telea method (Fast Marching Method)
- Navier-Stokes method (Fluid dynamics based PDE)
- Paper Background Tone Synthesizer for large uniform areas
"""

import cv2
import numpy as np
from typing import Optional, Literal


def inpaint_region(
    image: np.ndarray,
    mask: np.ndarray,
    method: Literal["telea", "ns", "paper_texture"] = "telea",
    radius: int = 3,
) -> np.ndarray:
    """Restores masked regions of an educational document.

    Args:
        image: BGR uint8 input image.
        mask: uint8 binary mask where 255 indicates region to inpaint/restore.
        method: Restoration algorithm: 'telea', 'ns', or 'paper_texture'.
        radius: Inpainting neighborhood radius.

    Returns:
        Restored uint8 image.
    """
    if np.all(mask == 0):
        return image.copy()

    # Ensure mask is single channel uint8
    if len(mask.shape) == 3:
        mask_gray = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    else:
        mask_gray = mask

    _, mask_bin = cv2.threshold(mask_gray, 127, 255, cv2.THRESH_BINARY)

    if method == "ns":
        return cv2.inpaint(image, mask_bin, inpaintRadius=max(1, radius), flags=cv2.INPAINT_NS)

    elif method == "paper_texture":
        # Estimate background paper color from non-masked surroundings
        inv_mask = cv2.bitwise_not(mask_bin)
        mean_bgr = cv2.mean(image, mask=inv_mask)[:3]
        
        # Base background fill
        bg_fill = np.full(image.shape, mean_bgr, dtype=np.uint8)
        
        # Add slight natural paper grain noise to prevent artificial plastic flatness
        noise = np.random.normal(0, 1.5, image.shape).astype(np.float32)
        bg_fill = np.clip(bg_fill.astype(np.float32) + noise, 0, 255).astype(np.uint8)

        # Smooth boundary transition
        blurred_mask = cv2.GaussianBlur(mask_bin, (radius * 2 + 1, radius * 2 + 1), 0)
        norm_mask = (blurred_mask.astype(np.float32) / 255.0)[:, :, None]

        restored = (image.astype(np.float32) * (1.0 - norm_mask) + bg_fill.astype(np.float32) * norm_mask)
        return np.clip(restored, 0, 255).astype(np.uint8)

    else:  # Default: Telea
        return cv2.inpaint(image, mask_bin, inpaintRadius=max(1, radius), flags=cv2.INPAINT_TELEA)
