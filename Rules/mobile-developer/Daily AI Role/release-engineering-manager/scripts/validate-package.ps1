[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$packageRoot = Split-Path -Parent $PSScriptRoot
$required = @(
    'README.md',
    'checklists/release-readiness.md',
    'examples/release-readiness.example.json',
    'hooks/pre-release-check.md',
    'knowledge/release-risk-framework.md',
    'rules/operating-rules.md',
    'schemas/release-readiness.schema.json',
    'scripts/validate-package.ps1',
    'scripts/validate-release.ps1',
    'skills/release-readiness-assessment.md',
    'subagents/release-reviewer.md',
    'templates/release-readiness-report.md',
    'tests/test-validate-release.ps1',
    'workflows/production-release.md'
)
$errors = [System.Collections.Generic.List[string]]::new()

foreach ($relativePath in $required) {
    $path = Join-Path $packageRoot $relativePath
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        $errors.Add("missing: $relativePath")
        continue
    }
    if ((Get-Item -LiteralPath $path).Length -eq 0) { $errors.Add("empty: $relativePath") }
}

foreach ($relativePath in @('schemas/release-readiness.schema.json', 'examples/release-readiness.example.json')) {
    $path = Join-Path $packageRoot $relativePath
    if (Test-Path -LiteralPath $path -PathType Leaf) {
        try { $null = Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json -ErrorAction Stop }
        catch { $errors.Add("invalid JSON in $relativePath`: $($_.Exception.Message)") }
    }
}

if ($errors.Count -gt 0) {
    Write-Error ("INVALID package:`n- " + ($errors -join "`n- "))
    exit 1
}

$pwsh = (Get-Command pwsh -ErrorAction Stop).Source
$example = Join-Path $packageRoot 'examples/release-readiness.example.json'
$validator = Join-Path $packageRoot 'scripts/validate-release.ps1'
$validationOutput = & $pwsh -NoProfile -File $validator -InputPath $example 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error ("Example validation failed:`n" + ($validationOutput -join "`n"))
    exit 1
}

Write-Output "Package valid: $($required.Count) required files present; JSON parsed; example passed."
exit 0
