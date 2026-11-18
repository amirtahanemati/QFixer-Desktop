import pytest
import sys
import os
import io

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from qfixer_engine.worker.main import EngineWorker
from qfixer_engine.worker.protocol import IpcMessage, PROTOCOL_VERSION


def test_worker_initialization_and_health():
    worker = EngineWorker()
    captured_output = []

    worker.send_message = lambda msg: captured_output.append(msg)

    # Initialize
    worker.handle_initialize("req-init", {"app_data_dir": "/tmp/qfixer"})
    assert len(captured_output) == 1
    assert captured_output[0].message_type == "result"
    assert captured_output[0].payload["status"] == "ready"

    # Health check
    worker.handle_health_check("req-health", {})
    assert len(captured_output) == 2
    assert captured_output[1].payload["pong"] is True
    assert captured_output[1].payload["initialized"] is True


def test_worker_cancel_flow():
    worker = EngineWorker()
    captured_output = []
    worker.send_message = lambda msg: captured_output.append(msg)

    worker.handle_cancel("req-cancel", {"target_request_id": "req-heavy-job"})
    assert "req-heavy-job" in worker.cancelled_requests
    assert captured_output[0].payload["success"] is True
