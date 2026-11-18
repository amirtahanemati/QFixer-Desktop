"""Tests for Scientific Content Detection and Multi-Layer Protection Masks (Phase 5)."""

import pytest
import numpy as np
import cv2
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from qfixer_engine.analysis.content_detector import analyze_scientific_content
from qfixer_engine.protection.protection_mask import create_protection_masks, apply_protected_blend


@pytest.fixture
def complex_scientific_doc():
    """Generates synthetic math/physics exam paper image with:
    - Text title and questions
    - Fraction and square root formula: (a / b) + sqrt(c^2 + d^2)
    - Coordinate axes with circle diagram
    """
    img = np.full((400, 600, 3), 250, dtype=np.uint8)

    # 1. Standard text line
    cv2.putText(img, "Physics Exam - Question 12", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (20, 20, 20), 2)

    # 2. Mathematical fraction line (long thin horizontal bar)
    cv2.line(img, (80, 150), (180, 150), (15, 15, 15), 2)
    cv2.putText(img, "delta x", (100, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (15, 15, 15), 1)
    cv2.putText(img, "delta t", (100, 170), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (15, 15, 15), 1)

    # 3. Geometric Diagram: Coordinate axes & circle
    cv2.line(img, (350, 100), (350, 350), (10, 10, 10), 2)  # Y-axis
    cv2.line(img, (300, 250), (550, 250), (10, 10, 10), 2)  # X-axis
    cv2.circle(img, (420, 250), 60, (25, 25, 180), 2)        # Circle

    return img


def test_scientific_content_analysis(complex_scientific_doc):
    analysis = analyze_scientific_content(complex_scientific_doc)

    assert analysis["total_components"] > 0
    assert analysis["counts"]["text"] > 0
    assert analysis["counts"]["diagram"] > 0
    assert analysis["counts"]["formula"] > 0
    assert analysis["image_dimensions"]["width"] == 600
    assert analysis["image_dimensions"]["height"] == 400


def test_protection_masks_generation(complex_scientific_doc):
    masks = create_protection_masks(
        complex_scientific_doc,
        preserve_fine_lines=True,
        preserve_formulas=True,
        preserve_text=True,
    )

    assert "text" in masks
    assert "formulas" in masks
    assert "diagrams" in masks
    assert "combined" in masks
    assert "raw_ink" in masks

    h, w, _ = complex_scientific_doc.shape
    assert masks["combined"].shape == (h, w)
    assert masks["combined"].dtype == np.uint8

    # Ink pixels should be protected (value 255)
    protected_pixels = np.sum(masks["combined"] == 255)
    assert protected_pixels > 500


def test_protected_blend(complex_scientific_doc):
    masks = create_protection_masks(complex_scientific_doc)
    protection_mask = masks["combined"]

    # Create an artificially aggressive filtered/blurred candidate
    blurred_candidate = cv2.GaussianBlur(complex_scientific_doc, (21, 21), 0)

    # Blend with original under protection mask
    blended = apply_protected_blend(complex_scientific_doc, blurred_candidate, protection_mask)

    assert blended.shape == complex_scientific_doc.shape
    assert blended.dtype == np.uint8

    # Where protection mask is active, pixel difference with original must be nearly zero
    protected_mask_bool = (protection_mask == 255)
    original_ink_vals = complex_scientific_doc[protected_mask_bool]
    blended_ink_vals = blended[protected_mask_bool]

    mean_diff = np.mean(np.abs(original_ink_vals.astype(float) - blended_ink_vals.astype(float)))
    assert mean_diff < 1.0  # Original content strictly preserved!
