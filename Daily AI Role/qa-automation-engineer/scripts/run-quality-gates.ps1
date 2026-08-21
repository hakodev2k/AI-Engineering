[CmdletBinding()]
param(
    [ValidateSet("Focused","Regression","Package")]
    [string]$Mode = "Package",
    [string]$TargetRepository = ".",
    [string]$TestCommand = "",
    [string]$LintCommand = ""
)

$ErrorActionPreference = "Stop"

function Invoke-Gate {
    param([string]$Name, [string]$Command)
    if ([string]::IsNullOrWhiteSpace($Command)) {
        Write-Host "SKIP [$Name] no command configured."
        return
    }
    Write-Host "RUN  [$Name] $Command"
    Push-Location $TargetRepository
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) { throw "$Name failed with exit code $LASTEXITCODE" }
    }
    finally { Pop-Location }
    Write-Host "PASS [$Name]"
}

if (-not (Test-Path $TargetRepository)) { throw "TargetRepository does not exist: $TargetRepository" }

$PackageRoot = Split-Path -Parent $PSScriptRoot
python (Join-Path $PSScriptRoot "validate-package.py") --root $PackageRoot
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ($Mode -eq "Package") {
    Write-Host "Package structural validation completed."
    exit 0
}

Invoke-Gate -Name "Lint/Static" -Command $LintCommand
Invoke-Gate -Name $Mode -Command $TestCommand
Write-Host "Quality gates completed for mode: $Mode"
