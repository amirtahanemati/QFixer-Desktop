#[tauri::command]
pub fn check_system_health() -> Result<String, String> {
    qfixer_contracts::system_health_status()
}
