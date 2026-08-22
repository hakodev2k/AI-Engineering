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

& $git.Source -C $Root rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Root is not a Git working tree"
    exit 3
}

Write-Host "Review validation context is ready"
exit 0
