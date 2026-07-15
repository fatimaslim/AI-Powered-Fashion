$targets = cmdkey /list | Select-String -Pattern 'Target:.*github' | ForEach-Object { $_.Line.Split(':')[1].Trim() }
foreach ($target in $targets) {
    cmdkey /delete:$target
}
Write-Host "Done!"
