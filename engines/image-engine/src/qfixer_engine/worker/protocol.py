"""IPC Protocol definitions and message parsing for QFixer Engine."""

from dataclasses import dataclass
from typing import Any, Dict, Optional
import json

PROTOCOL_VERSION = "2.0.0"


@dataclass
class IpcMessage:
    protocol_version: str
    message_type: str
    request_id: str
    payload: Dict[str, Any]

    def to_json(self) -> str:
        return json.dumps(
            {
                "protocol_version": self.protocol_version,
                "message_type": self.message_type,
                "request_id": self.request_id,
                "payload": self.payload,
            },
            ensure_ascii=False,
        )

    @classmethod
    def from_json(cls, line: str) -> "IpcMessage":
        data = json.loads(line.strip())
        version = data.get("protocol_version")
        if version != PROTOCOL_VERSION:
            raise ValueError(f"Unsupported protocol version: {version}. Expected: {PROTOCOL_VERSION}")
        return cls(
            protocol_version=data["protocol_version"],
            message_type=data["message_type"],
            request_id=data["request_id"],
            payload=data.get("payload", {}),
        )


def make_result_message(request_id: str, payload: Dict[str, Any]) -> IpcMessage:
    return IpcMessage(
        protocol_version=PROTOCOL_VERSION,
        message_type="result",
        request_id=request_id,
        payload=payload,
    )


def make_error_message(request_id: str, code: str, message: str, details: Optional[str] = None) -> IpcMessage:
    return IpcMessage(
        protocol_version=PROTOCOL_VERSION,
        message_type="error",
        request_id=request_id,
        payload={
            "code": code,
            "message": message,
            "details": details,
        },
    )
