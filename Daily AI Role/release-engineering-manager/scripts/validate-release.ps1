param([string]$ReleaseName)

if ([string]::IsNullOrWhiteSpace($ReleaseName)) {
    Write-Error "Release name is required"
    exit 1
}

Write-Output "Release validation started: $ReleaseName"
exit 0
