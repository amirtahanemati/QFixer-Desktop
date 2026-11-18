use qfixer_contracts::{HealthPayload, IpcMessage, PROTOCOL_VERSION};
use serde::{Deserialize, Serialize};
use std::process::{Child, Command, Stdio};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessRequestOptions {
    pub input_path: String,
    pub output_path: String,
    pub shadow_removal: u8,
    pub noise_removal: u8,
    pub protect_text: bool,
    pub protect_formulas: bool,
    pub protect_diagrams: bool,
}

pub struct WorkerSupervisor {
    child: Option<Child>,
}

impl WorkerSupervisor {
    pub fn new() -> Self {
        Self { child: None }
    }

    pub fn start(&mut self, python_bin: &str, script_path: &str) -> Result<(), String> {
        let child = Command::new(python_bin)
            .arg(script_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::inherit())
            .spawn()
            .map_err(|e| format!("Failed to spawn python worker: {e}"))?;

        self.child = Some(child);
        Ok(())
    }

    pub fn is_alive(&mut self) -> bool {
        if let Some(ref mut child) = self.child {
            match child.try_wait() {
                Ok(None) => true,
                _ => false,
            }
        } else {
            false
        }
    }

    pub fn stop(&mut self) {
        if let Some(ref mut child) = self.child {
            let _ = child.kill();
        }
        self.child = None;
    }
}

pub fn create_health_check_message(req_id: &str) -> IpcMessage<HealthPayload> {
    IpcMessage {
        protocol_version: PROTOCOL_VERSION.to_string(),
        message_type: "health_check".to_string(),
        request_id: req_id.to_string(),
        payload: HealthPayload { ping: true },
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_health_message() {
        let msg = create_health_check_message("req-999");
        assert_eq!(msg.message_type, "health_check");
        assert_eq!(msg.request_id, "req-999");
        assert!(msg.payload.ping);
    }
}
