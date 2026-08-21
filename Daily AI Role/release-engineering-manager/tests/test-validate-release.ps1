[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$packageRoot = Split-Path -Parent $PSScriptRoot
$validator = Join-Path $packageRoot 'scripts/validate-release.ps1'
$example = Join-Path $packageRoot 'examples/release-readiness.example.json'
$pwsh = (Get-Command pwsh -ErrorAction Stop).Source
$temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("release-readiness-test-" + [guid]::NewGuid().ToString('N'))
$resolvedTemporaryRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
$resolvedTemporaryDirectory = [System.IO.Path]::GetFullPath($temporaryDirectory)
if (-not $resolvedTemporaryDirectory.StartsWith($resolvedTemporaryRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to use a test directory outside the system temporary root: $resolvedTemporaryDirectory"
}
$failures = [System.Collections.Generic.List[string]]::new()

New-Item -ItemType Directory -Path $temporaryDirectory | Out-Null
try {
    $output = & $pwsh -NoProfile -File $validator -InputPath $example 2>&1
    if ($LASTEXITCODE -ne 0 -or ($output -join "`n") -notmatch 'READY:') {
        $failures.Add('valid example did not return READY/exit 0')
    }

    $blockedPath = Join-Path $temporaryDirectory 'blocked.json'
    $blocked = Get-Content -LiteralPath $example -Raw -Encoding UTF8 | ConvertFrom-Json
    $blocked.tests[0].status = 'failed'
    $blocked | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $blockedPath -Encoding UTF8
    $output = & $pwsh -NoProfile -File $validator -InputPath $blockedPath 2>&1
    if ($LASTEXITCODE -ne 1 -or ($output -join "`n") -notmatch 'BLOCKED') {
        $failures.Add('failed required test did not return BLOCKED/exit 1')
    }

    $invalidPath = Join-Path $temporaryDirectory 'invalid.json'
    Set-Content -LiteralPath $invalidPath -Value '{invalid' -Encoding UTF8
    $output = & $pwsh -NoProfile -File $validator -InputPath $invalidPath 2>&1
    if ($LASTEXITCODE -ne 2 -or ($output -join "`n") -notmatch 'INVALID') {
        $failures.Add('malformed JSON did not return INVALID/exit 2')
    }
}
finally {
    if (Test-Path -LiteralPath $temporaryDirectory) {
        Remove-Item -LiteralPath $temporaryDirectory -Recurse -Force
    }
}

if ($failures.Count -gt 0) {
    Write-Error ("Tests failed:`n- " + ($failures -join "`n- "))
    exit 1
}

Write-Output 'PASS: valid, blocked, and malformed release cases behaved as expected.'
exit 0
