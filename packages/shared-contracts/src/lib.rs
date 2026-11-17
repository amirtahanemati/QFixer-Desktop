use serde::{Deserialize, Serialize};

pub const PROTOCOL_VERSION: &str = "2.0.0";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct IpcMessage<T> {
    pub protocol_version: String,
    pub message_type: String,
    pub request_id: String,
    pub payload: T,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct HealthPayload {
    pub ping: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ProgressPayload {
    pub percent: u8,
    pub stage: String,
    pub eta_seconds: Option<u32>,
}

pub fn system_health_status() -> Result<String, String> {
    Ok("QFixer Core Online".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ipc_health_message_serialization() {
        let msg = IpcMessage {
            protocol_version: PROTOCOL_VERSION.to_string(),
            message_type: "health_check".to_string(),
            request_id: "req-001".to_string(),
            payload: HealthPayload { ping: true },
        };

        let serialized = serde_json::to_string(&msg).expect("Serialize failed");
        let deserialized: IpcMessage<HealthPayload> =
            serde_json::from_str(&serialized).expect("Deserialize failed");

        assert_eq!(msg, deserialized);
        assert_eq!(deserialized.protocol_version, "2.0.0");
    }

    #[test]
    fn test_ipc_progress_message_serialization() {
        let msg = IpcMessage {
            protocol_version: PROTOCOL_VERSION.to_string(),
            message_type: "progress".to_string(),
            request_id: "req-002".to_string(),
            payload: ProgressPayload {
                percent: 50,
                stage: "حذف سایه و تصحیح نور".to_string(),
                eta_seconds: Some(3),
            },
        };

        let serialized = serde_json::to_string(&msg).expect("Serialize failed");
        let deserialized: IpcMessage<ProgressPayload> =
            serde_json::from_str(&serialized).expect("Deserialize failed");

        assert_eq!(msg, deserialized);
        assert_eq!(deserialized.payload.percent, 50);
    }

    #[test]
    fn test_system_health_status() {
        let status = system_health_status();
        assert!(status.is_ok());
        assert_eq!(status.unwrap(), "QFixer Core Online");
    }
}
