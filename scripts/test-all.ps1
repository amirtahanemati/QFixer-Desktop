# QFixer Desktop - Comprehensive Test Suite Runner
$ErrorActionPreference = "Stop"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "     اجرای آزمون‌های یکپارچه QFixer Desktop          " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# 1. Python Engine Tests
Write-Host "`n[1/3] اجرای آزمون‌های موتور پایتون (Pytest)..." -ForegroundColor Yellow
python -m pytest engines/image-engine/tests
if ($LASTEXITCODE -ne 0) {
    Write-Error "تست‌های پایتون با خطا مواجه شدند!"
    exit 1
}

# 2. Frontend Tests
Write-Host "`n[2/3] اجرای آزمون‌های فرانت‌اند (Vitest)..." -ForegroundColor Yellow
Set-Location apps/desktop
pnpm test
if ($LASTEXITCODE -ne 0) {
    Write-Error "تست‌های فرانت‌اند با خطا مواجه شدند!"
    exit 1
}
Set-Location ../..

# 3. Rust Contracts & IPC Tests
Write-Host "`n[3/3] اجرای آزمون‌های هسته و پروتکل Rust (Cargo Test)..." -ForegroundColor Yellow
$mingwBin = "C:\Users\Amirtaha\AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin"
$env:PATH = "$mingwBin;$env:USERPROFILE\.cargo\bin;$env:PATH"
Set-Location packages/shared-contracts
cargo test
if ($LASTEXITCODE -ne 0) {
    Write-Error "تست‌های Rust با خطا مواجه شدند!"
    exit 1
}
Set-Location ../..

Write-Host "`n=====================================================" -ForegroundColor Green
Write-Host "     تمام آزمون‌های پروژه با موفقیت ۱۰۰٪ پاس شدند!   " -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
