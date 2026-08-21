param([string]$Root = ".")

if (!(Test-Path $Root)) {
    Write-Error "Repository path not found"
    exit 1
}

$git = Get-Command git -ErrorAction SilentlyContinue
if ($null -eq $git) {
    Write-Error "git is required"
    exit 2
}

Write-Host "Review validation context is ready"
exit 0
