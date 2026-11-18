"""Tests for Non-Destructive Inpainting and Watermark Removal (Phase 6)."""

import pytest
import numpy as np
import cv2
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from qfixer_engine.restoration.inpainting import inpaint_region
from qfixer_engine.restoration.watermark import detect_watermark_mask, remove_watermark


@pytest.fixture
def document_with_stain_and_watermark():
    """Generates synthetic exam question with:
    - Dark black text: "Q1. Calculate the integral"
    - Dark math formula: "\int x dx"
    - An ugly brown smudge/stain on the side
    - A faint gray watermark across the center: "SAMPLE EXAM"
    """
    img = np.full((350, 500, 3), 245, dtype=np.uint8)

    # Dark scientific ink
    cv2.putText(img, "Q1. Calculate the integral:", (40, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (15, 15, 15), 2)
    cv2.putText(img, "int x dx = x^2 / 2 + C", (70, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (10, 10, 10), 2)

    # Dark coffee/dirt stain on bottom corner
    cv2.circle(img, (400, 280), 30, (80, 110, 140), -1)

    # Faint gray watermark diagonally across
    cv2.putText(img, "SAMPLE WATERMARK", (60, 220), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (185, 185, 185), 2)

    return img


def test_inpainting_telea(document_with_stain_and_watermark):
    # Mask specifically targeting the stain at (400, 280)
    mask = np.zeros((350, 500), dtype=np.uint8)
    cv2.circle(mask, (400, 280), 32, 255, -1)

    restored = inpaint_region(document_with_stain_and_watermark, mask, method="telea")

    assert restored.shape == document_with_stain_and_watermark.shape
    assert restored.dtype == np.uint8

    # The stain area in restored image should be close to paper background (brightness > 200)
    stain_region_mean = np.mean(restored[270:290, 390:410])
    assert stain_region_mean > 200


def test_inpainting_paper_texture(document_with_stain_and_watermark):
    mask = np.zeros((350, 500), dtype=np.uint8)
    cv2.circle(mask, (400, 280), 32, 255, -1)

    restored = inpaint_region(document_with_stain_and_watermark, mask, method="paper_texture")
    assert restored.shape == document_with_stain_and_watermark.shape


def test_watermark_detection_and_removal(document_with_stain_and_watermark):
    restored, mask = remove_watermark(document_with_stain_and_watermark, sensitivity=0.6)

    assert restored.shape == document_with_stain_and_watermark.shape
    assert mask.shape == (350, 500)

    # Original dark text at (40, 60) must NOT be masked out as watermark!
    text_sample_mask = mask[55:65, 40:120]
    # Check that dark ink is protected
    assert np.mean(text_sample_mask) < 40
