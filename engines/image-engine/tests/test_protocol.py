import pytest
import sys
import os

# Ensure package is discoverable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from qfixer_engine.worker.protocol import IpcMessage, PROTOCOL_VERSION, make_result_message, make_error_message


def test_ipc_message_serialization():
    msg = IpcMessage(
        protocol_version=PROTOCOL_VERSION,
        message_type="health_check",
        request_id="req-123",
        payload={"ping": True},
    )
    raw = msg.to_json()
    parsed = IpcMessage.from_json(raw)
    assert parsed.protocol_version == PROTOCOL_VERSION
    assert parsed.message_type == "health_check"
    assert parsed.request_id == "req-123"
    assert parsed.payload["ping"] is True


def test_invalid_protocol_version():
    with pytest.raises(ValueError, match="Unsupported protocol version"):
        IpcMessage.from_json('{"protocol_version": "1.0.0", "message_type": "ping", "request_id": "1"}')


def test_result_and_error_helpers():
    res = make_result_message("req-1", {"status": "ok"})
    assert res.message_type == "result"
    assert res.payload["status"] == "ok"

    err = make_error_message("req-2", "FILE_NOT_FOUND", "Cannot find image file")
    assert err.message_type == "error"
    assert err.payload["code"] == "FILE_NOT_FOUND"
