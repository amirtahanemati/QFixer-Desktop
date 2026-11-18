"""Batch Processing Queue and Multiprocessing Image Task Runner.

Processes multi-page exams, scanned booklets, and image folders
with progressive status reporting, quality validation, and safe error isolation.
"""

import os
import time
from typing import List, Dict, Any, Callable, Optional
import cv2

from qfixer_engine.processing.pipeline import execute_pipeline
from qfixer_engine.protection.protection_mask import create_protection_masks
from qfixer_engine.quality.evaluator import evaluate_restoration_quality


def process_batch_files(
    file_items: List[Dict[str, Any]],
    options: Dict[str, Any],
    progress_callback: Optional[Callable[[int, int, str, Dict[str, Any]], None]] = None,
    cancel_check: Optional[Callable[[], bool]] = None,
) -> Dict[str, Any]:
    """Processes a batch queue of educational images sequentially and safely.

    Args:
        file_items: List of dicts with 'input_path' and optional 'output_path'
        options: Image processing parameters
        progress_callback: Function called after each item with (current_idx, total, status, details)
        cancel_check: Function returning True if batch cancellation requested

    Returns:
        Summary report containing successes, errors, and aggregate metrics.
    """
    total = len(file_items)
    results = []
    errors = []
    start_time = time.time()

    for idx, item in enumerate(file_items):
        if cancel_check and cancel_check():
            break

        input_path = item.get("input_path", "")
        output_path = item.get("output_path", "")

        if not output_path:
            base, ext = os.path.splitext(input_path)
            output_path = f"{base}_qfixed{ext or '.png'}"

        if not os.path.exists(input_path):
            err_info = {"input_path": input_path, "error": "File does not exist"}
            errors.append(err_info)
            if progress_callback:
                progress_callback(idx + 1, total, "error", err_info)
            continue

        try:
            img = cv2.imread(input_path)
            if img is None:
                raise ValueError("Image decode failed")

            # 1. Protection masks
            masks = create_protection_masks(
                img,
                preserve_fine_lines=options.get("protect_diagrams", True),
                preserve_formulas=options.get("protect_formulas", True),
                preserve_text=options.get("protect_text", True),
            )

            # 2. Pipeline execution
            processed = execute_pipeline(img, options, protection_mask=masks["combined"])

            # 3. Quality evaluation
            metrics = evaluate_restoration_quality(img, processed, masks["raw_ink"])

            # 4. Save output
            os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
            cv2.imwrite(output_path, processed)

            res_entry = {
                "input_path": input_path,
                "output_path": output_path,
                "success": True,
                "metrics": metrics,
            }
            results.append(res_entry)

            if progress_callback:
                progress_callback(idx + 1, total, "success", res_entry)

        except Exception as e:
            err_info = {"input_path": input_path, "error": str(e)}
            errors.append(err_info)
            if progress_callback:
                progress_callback(idx + 1, total, "failed", err_info)

    total_time_ms = int((time.time() - start_time) * 1000)

    return {
        "total_queued": total,
        "processed_count": len(results),
        "failed_count": len(errors),
        "total_time_ms": total_time_ms,
        "results": results,
        "errors": errors,
    }
