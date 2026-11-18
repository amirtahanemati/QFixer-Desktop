"""AI Model Registry and Safe ONNX Runtime Inference Runner.

Enforces offline security through cryptographic SHA-256 verification,
prevents arbitrary binary code execution, and handles hardware acceleration fallback.
"""

import os
import json
import hashlib
from typing import Dict, Any, List, Optional
import onnxruntime as ort


def calculate_sha256(file_path: str) -> str:
    """Calculates SHA-256 hash of a local file in 64KB chunks."""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(65536), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest().lower()


def validate_model_integrity(model_path: str, expected_sha256: str) -> bool:
    """Verifies that an ONNX model file exists and exactly matches its certified SHA-256 hash."""
    if not os.path.exists(model_path):
        return False
    actual_hash = calculate_sha256(model_path)
    return actual_hash == expected_sha256.lower()


class ModelRegistryManager:
    """Manages AI model discovery, integrity checks, and execution provider binding."""

    def __init__(self, registry_path: Optional[str] = None):
        if registry_path is None:
            # Search upwards for models/registry.json from current file
            cur = os.path.abspath(os.path.dirname(__file__))
            candidate = None
            for _ in range(6):
                possible = os.path.join(cur, "models", "registry.json")
                if os.path.exists(possible):
                    candidate = possible
                    break
                parent = os.path.dirname(cur)
                if parent == cur:
                    break
                cur = parent
            registry_path = candidate or os.path.abspath("models/registry.json")

        self.registry_path = registry_path
        self.models_dir = os.path.dirname(registry_path)
        self.data: Dict[str, Any] = self._load_registry()

    def _load_registry(self) -> Dict[str, Any]:
        if not os.path.exists(self.registry_path):
            return {"registry_version": "1.0.0", "models": []}
        try:
            with open(self.registry_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"registry_version": "1.0.0", "models": []}

    def list_models_status(self) -> List[Dict[str, Any]]:
        """Returns all models from registry with their real-time installation and verification status."""
        results = []
        for model in self.data.get("models", []):
            model_file = os.path.join(self.models_dir, f"{model['id']}.onnx")
            installed = os.path.exists(model_file)
            is_valid = False
            if installed:
                is_valid = validate_model_integrity(model_file, model.get("sha256", ""))

            entry = dict(model)
            entry["installed"] = installed
            entry["verified_valid"] = is_valid
            entry["local_path"] = model_file if installed else None
            results.append(entry)
        return results

    def create_session(
        self,
        model_id: str,
        preferred_provider: Optional[str] = None,
    ) -> Optional[ort.InferenceSession]:
        """Creates an ONNX Runtime InferenceSession with automatic provider fallback.

        Priority order: CUDA/DirectML -> CPU fallback.
        """
        for model in self.list_models_status():
            if model["id"] == model_id:
                if not model["installed"] or not model["verified_valid"]:
                    return None

                providers = ["CPUExecutionProvider"]
                available = ort.get_available_providers()
                if preferred_provider == "cuda" and "CUDAExecutionProvider" in available:
                    providers.insert(0, "CUDAExecutionProvider")
                elif preferred_provider == "dml" and "DmlExecutionProvider" in available:
                    providers.insert(0, "DmlExecutionProvider")

                opts = ort.SessionOptions()
                opts.intra_op_num_threads = max(1, (os.cpu_count() or 4) // 2)
                return ort.InferenceSession(model["local_path"], sess_options=opts, providers=providers)

        return None
