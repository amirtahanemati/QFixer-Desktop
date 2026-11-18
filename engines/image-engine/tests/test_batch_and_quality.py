"""Tests for Quality Evaluation Metrics and Batch Processing (Phase 8)."""

import pytest
import os
import sys
import tempfile
import numpy as np
import cv2

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from qfixer_engine.quality.evaluator import calculate_sharpness, evaluate_restoration_quality
from qfixer_engine.batch.batch_runner import process_batch_files


@pytest.fixture
def synthetic_page():
    img = np.full((300, 400, 3), 240, dtype=np.uint8)
    cv2.putText(img, "QFixer Scientific Question 1", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (20, 20, 20), 2)
    cv2.circle(img, (200, 180), 40, (10, 10, 150), 2)
    return img


def test_sharpness_and_quality_evaluation(synthetic_page):
    sharpness = calculate_sharpness(synthetic_page)
    assert sharpness > 0

    # Create processed candidate and ink mask
    ink_mask = np.zeros((300, 400), dtype=np.uint8)
    ink_mask[40:60, 30:300] = 255
    cv2.circle(ink_mask, (200, 180), 40, 255, 2)

    eval_result = evaluate_restoration_quality(synthetic_page, synthetic_page, ink_mask)

    assert "sharpness" in eval_result
    assert "noise_reduction_pct" in eval_result
    assert "ink_preservation_pct" in eval_result
    assert eval_result["ink_preservation_pct"] >= 95.0
    assert eval_result["is_safe_for_science"] is True


def test_batch_runner_execution(synthetic_page):
    with tempfile.TemporaryDirectory() as tmp_dir:
        # Create 3 synthetic test files
        items = []
        for i in range(3):
            file_path = os.path.join(tmp_dir, f"page_{i}.png")
            cv2.imwrite(file_path, synthetic_page)
            out_path = os.path.join(tmp_dir, f"page_{i}_out.png")
            items.append({"input_path": file_path, "output_path": out_path})

        options = {"shadow_removal": 30, "noise_removal": 20}
        progress_records = []

        def on_progress(cur, total, status, details):
            progress_records.append((cur, total, status))

        summary = process_batch_files(items, options, progress_callback=on_progress)

        assert summary["total_queued"] == 3
        assert summary["processed_count"] == 3
        assert summary["failed_count"] == 0
        assert len(progress_records) == 3

        # Verify output files exist on disk
        for item in items:
            assert os.path.exists(item["output_path"])
