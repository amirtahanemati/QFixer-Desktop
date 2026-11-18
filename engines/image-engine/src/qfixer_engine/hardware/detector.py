"""System Hardware Detection and Acceleration Provider Discovery.

Inspects CPU topology, system RAM, and checks for hardware acceleration
execution providers (CUDA, DirectML, or CPU fallback).
"""

import os
import sys
import platform
import psutil
from typing import Dict, Any, List


def detect_system_hardware() -> Dict[str, Any]:
    """Inspects host machine hardware and acceleration capabilities.

    Returns:
        Structured hardware report for desktop status display and runner configuration.
    """
    cpu_count_logical = os.cpu_count() or 1
    cpu_count_physical = psutil.cpu_count(logical=False) or cpu_count_logical
    mem = psutil.virtual_memory()

    total_ram_gb = round(mem.total / (1024 ** 3), 2)
    available_ram_gb = round(mem.available / (1024 ** 3), 2)

    available_providers: List[str] = ["CPUExecutionProvider"]
    best_provider = "CPU"
    gpu_name = "N/A (CPU Mode)"

    # Check ONNX Runtime available execution providers
    try:
        import onnxruntime as ort
        available_ort_providers = ort.get_available_providers()

        if "CUDAExecutionProvider" in available_ort_providers:
            available_providers.insert(0, "CUDAExecutionProvider")
            best_provider = "NVIDIA CUDA"
            gpu_name = "NVIDIA GeForce / RTX Series"
        elif "DmlExecutionProvider" in available_ort_providers:
            available_providers.insert(0, "DmlExecutionProvider")
            best_provider = "DirectML (DirectX 12)"
            gpu_name = "DirectML Compatible GPU"
        else:
            best_provider = "CPU (Multi-Threaded)"
    except Exception:
        best_provider = "CPU (Multi-Threaded)"

    return {
        "platform": f"{platform.system()} {platform.release()} ({platform.machine()})",
        "cpu": {
            "name": platform.processor() or "x86_64 Compatible Processor",
            "cores_physical": cpu_count_physical,
            "cores_logical": cpu_count_logical,
        },
        "memory": {
            "total_gb": total_ram_gb,
            "available_gb": available_ram_gb,
            "percent_used": mem.percent,
        },
        "acceleration": {
            "best_provider": best_provider,
            "gpu_name": gpu_name,
            "providers": available_providers,
            "hardware_accel_available": (best_provider != "CPU (Multi-Threaded)"),
        },
    }
