"""Scientific Content Detection and Component Classification Module.

Distinguishes between:
- Text regions (Persian/English words, punctuation)
- Math formulas (radicals, fractions, integrals, exponents, subscripts)
- Geometric shapes & scientific diagrams (lines, vectors, axes, circles)
- Noise & background artifacts
"""

import cv2
import numpy as np
from typing import Dict, List, Tuple, Any


class ContentClassification:
    TEXT = "text"
    FORMULA = "formula"
    DIAGRAM = "diagram"
    NOISE = "noise"


def analyze_scientific_content(image: np.ndarray) -> Dict[str, Any]:
    """Analyzes an educational image to segment and classify all content components.
    
    Args:
        image: BGR or Grayscale uint8 image.
        
    Returns:
        Dictionary containing counts, bounding boxes, and classified component statistics.
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()

    h, w = gray.shape

    # Adaptive binarization to extract ink from paper
    binary = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        25,
        15,
    )

    # Connected Component Analysis with statistics
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary, connectivity=8)

    text_components = []
    formula_components = []
    diagram_components = []
    noise_components = []

    # Filter background component at index 0
    for i in range(1, num_labels):
        x = stats[i, cv2.CC_STAT_LEFT]
        y = stats[i, cv2.CC_STAT_TOP]
        comp_w = stats[i, cv2.CC_STAT_WIDTH]
        comp_h = stats[i, cv2.CC_STAT_HEIGHT]
        area = stats[i, cv2.CC_STAT_AREA]

        aspect_ratio = float(comp_w) / max(comp_h, 1)
        extent = float(area) / (comp_w * comp_h)

        # Extremely small components (likely salt-and-pepper scan noise)
        if area <= 4:
            noise_components.append((x, y, comp_w, comp_h))
            continue

        # Math formula indicators:
        # 1. Fraction line: thin horizontal bar (comp_h <= 6, 12 <= comp_w <= 180)
        # 2. Tall symbols: integral, brackets, summation (aspect_ratio < 0.35 and comp_h >= 18)
        is_fraction_bar = (comp_h <= 6 and 12 <= comp_w <= 180)
        is_tall_math_sym = (aspect_ratio < 0.35 and comp_h >= 18)
        if is_fraction_bar or is_tall_math_sym:
            formula_components.append((x, y, comp_w, comp_h))
            continue

        # Diagram or coordinate axis / geometric shape detection:
        # 1. Very long axis strokes across the page
        # 2. Large 2D geometric shapes (circles, diagrams, coordinate grids)
        is_long_axis = (comp_w > w * 0.35 and comp_h < 25) or (comp_h > h * 0.20 and comp_w < 25)
        is_geometric_shape = (comp_w >= 35 and comp_h >= 35 and area >= 60)
        is_large_drawing = (area > 400 and (aspect_ratio > 2.5 or aspect_ratio < 0.4))

        if is_long_axis or is_geometric_shape or is_large_drawing:
            diagram_components.append((x, y, comp_w, comp_h))
            continue

        # Standard text character or word segment
        text_components.append((x, y, comp_w, comp_h))

    return {
        "image_dimensions": {"width": w, "height": h},
        "total_components": num_labels - 1,
        "counts": {
            "text": len(text_components),
            "formula": len(formula_components),
            "diagram": len(diagram_components),
            "noise": len(noise_components),
        },
        "boxes": {
            "text": text_components,
            "formula": formula_components,
            "diagram": diagram_components,
            "noise": noise_components,
        },
    }
