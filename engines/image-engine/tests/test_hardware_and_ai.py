"""Tests for Hardware Detection and AI Model Registry (Phase 7)."""

import pytest
import os
import sys
import tempfile

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from qfixer_engine.hardware.detector import detect_system_hardware
from qfixer_engine.ai.onnx_runner import (
    calculate_sha256,
    validate_model_integrity,
    ModelRegistryManager,
)


def test_hardware_detection():
    hw = detect_system_hardware()

    assert "platform" in hw
    assert "cpu" in hw
    assert "memory" in hw
    assert "acceleration" in hw

    assert hw["cpu"]["cores_logical"] >= 1
    assert hw["memory"]["total_gb"] > 0
    assert "best_provider" in hw["acceleration"]
    assert len(hw["acceleration"]["providers"]) >= 1


def test_sha256_verification_and_tamper_detection():
    # Create temporary dummy file
    with tempfile.NamedTemporaryFile("w", delete=False, suffix=".bin") as f:
        f.write("QFixer Model Weight Binary Test Content 12345")
        temp_path = f.name

    try:
        calculated_hash = calculate_sha256(temp_path)
        assert len(calculated_hash) == 64

        # True hash must validate
        assert validate_model_integrity(temp_path, calculated_hash) is True

        # Tampered hash must fail validation
        fake_tampered_hash = "a" * 64
        assert validate_model_integrity(temp_path, fake_tampered_hash) is False
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def test_model_registry_discovery():
    mgr = ModelRegistryManager()
    models = mgr.list_models_status()

    assert len(models) >= 3
    model_ids = [m["id"] for m in models]
    assert "shadow-remover-base" in model_ids
    assert "text-region-detector" in model_ids
    assert "scientific-inpainting" in model_ids
