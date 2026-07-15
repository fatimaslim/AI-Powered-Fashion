$env:GCM_PROVIDER="github"
$env:GCM_INTERACTIVE="never"
$env:GCM_DEVICE_CODE="1"
$env:GCM_CREDENTIAL_STORE="plaintext"

Write-Host "========================================================"
Write-Host "Forcing Device Login to bypass Windows auto-login bug..."
Write-Host "========================================================"

git push -u origin main
