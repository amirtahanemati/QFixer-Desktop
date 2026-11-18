import pytest
import numpy as np
import cv2
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from qfixer_engine.processing.shadow_removal import remove_shadows, estimate_background
from qfixer_engine.processing.noise_removal import remove_noise
from qfixer_engine.processing.lighting import adjust_brightness_contrast
from qfixer_engine.processing.sharpening import sharpen_image
from qfixer_engine.processing.pipeline import execute_pipeline


@pytest.fixture
def synthetic_exam_image():
    """Generates synthetic image with text, diagram, and dark shadow gradient."""
    img = np.full((300, 400, 3), 245, dtype=np.uint8)  # White paper background

    # Add dark text line
    cv2.putText(img, "y = sqrt(x^2 + 1)", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (20, 20, 20), 2)
    # Add diagram circle
    cv2.circle(img, (200, 200), 40, (10, 10, 180), 2)

    # Add strong shadow gradient from top
    shadow = np.tile(np.linspace(0.4, 1.0, 300)[:, None, None], (1, 400, 3))
    shadowed_img = np.clip(img.astype(np.float32) * shadow, 0, 255).astype(np.uint8)
    return shadowed_img


def test_shadow_removal(synthetic_exam_image):
    result = remove_shadows(synthetic_exam_image, strength=0.7)
    assert result.shape == synthetic_exam_image.shape
    assert result.dtype == np.uint8

    # The shadowed top region should be brighter after shadow removal
    top_original_mean = np.mean(synthetic_exam_image[:50, :])
    top_cleaned_mean = np.mean(result[:50, :])
    assert top_cleaned_mean > top_original_mean


def test_noise_removal(synthetic_exam_image):
    # Add gaussian noise
    noise = np.random.normal(0, 15, synthetic_exam_image.shape).astype(np.float32)
    noisy = np.clip(synthetic_exam_image.astype(np.float32) + noise, 0, 255).astype(np.uint8)

    denoised = remove_noise(noisy, strength=0.5)
    assert denoised.shape == noisy.shape


def test_pipeline_execution(synthetic_exam_image):
    options = {
        "shadow_removal": 60,
        "noise_removal": 30,
        "brightness": 5,
        "contrast": 10,
        "sharpening": 25,
        "protect_text": True,
    }
    output = execute_pipeline(synthetic_exam_image, options)
    assert output.shape == synthetic_exam_image.shape
    assert output.dtype == np.uint8
