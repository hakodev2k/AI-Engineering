[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$InputPath
)

$ErrorActionPreference = 'Stop'
$validationErrors = [System.Collections.Generic.List[string]]::new()
$blockers = [System.Collections.Generic.List[string]]::new()

function Get-PropertyValue {
    param(
        [object]$Object,
        [string]$Name
    )
    if ($null -eq $Object) { return $null }
    $property = $Object.PSObject.Properties[$Name]
    if ($null -eq $property) { return $null }
    return $property.Value
}

function Require-Text {
    param(
        [object]$Object,
        [string]$Name,
        [string]$Path
    )
    $value = Get-PropertyValue -Object $Object -Name $Name
    if ($value -isnot [string] -or [string]::IsNullOrWhiteSpace($value)) {
        $validationErrors.Add("$Path.$Name must be a non-empty string")
    }
    return $value
}

try {
    $resolvedPath = (Resolve-Path -LiteralPath $InputPath -ErrorAction Stop).Path
    $content = Get-Content -LiteralPath $resolvedPath -Raw -Encoding UTF8 -ErrorAction Stop
    $release = $content | ConvertFrom-Json -ErrorAction Stop
}
catch {
    [Console]::Error.WriteLine("INVALID: cannot read or parse release input: $($_.Exception.Message)")
    exit 2
}

if ($release -isnot [pscustomobject]) {
    [Console]::Error.WriteLine('INVALID: document root must be a JSON object')
    exit 2
}

$releaseName = Require-Text -Object $release -Name 'release_name' -Path '$'
$null = Require-Text -Object $release -Name 'owner' -Path '$'
$environment = Require-Text -Object $release -Name 'environment' -Path '$'
$risk = Require-Text -Object $release -Name 'risk' -Path '$'

if ($environment -and $environment -notin @('development', 'test', 'staging', 'production')) {
    $validationErrors.Add('$.environment must be development, test, staging, or production')
}
if ($risk -and $risk -notin @('low', 'medium', 'high', 'critical')) {
    $validationErrors.Add('$.risk must be low, medium, high, or critical')
}

$artifact = Get-PropertyValue -Object $release -Name 'artifact'
if ($artifact -isnot [pscustomobject]) {
    $validationErrors.Add('$.artifact must be an object')
}
else {
    $null = Require-Text -Object $artifact -Name 'name' -Path '$.artifact'
    $null = Require-Text -Object $artifact -Name 'version' -Path '$.artifact'
    $null = Require-Text -Object $artifact -Name 'digest' -Path '$.artifact'
    $immutable = Get-PropertyValue -Object $artifact -Name 'immutable'
    if ($immutable -isnot [bool]) { $validationErrors.Add('$.artifact.immutable must be a boolean') }
    elseif (-not $immutable) { $blockers.Add('artifact is not declared immutable') }
}

$tests = @(Get-PropertyValue -Object $release -Name 'tests')
if ($tests.Count -eq 0 -or $null -eq $tests[0]) {
    $validationErrors.Add('$.tests must be a non-empty array')
}
else {
    for ($index = 0; $index -lt $tests.Count; $index++) {
        $test = $tests[$index]
        if ($test -isnot [pscustomobject]) {
            $validationErrors.Add("$.tests[$index] must be an object")
            continue
        }
        $testName = Require-Text -Object $test -Name 'name' -Path "$.tests[$index]"
        $status = Require-Text -Object $test -Name 'status' -Path "$.tests[$index]"
        $null = Require-Text -Object $test -Name 'evidence' -Path "$.tests[$index]"
        $required = Get-PropertyValue -Object $test -Name 'required'
        if ($required -isnot [bool]) { $validationErrors.Add("$.tests[$index].required must be a boolean") }
        if ($status -and $status -notin @('passed', 'failed', 'skipped')) {
            $validationErrors.Add("$.tests[$index].status must be passed, failed, or skipped")
        }
        elseif ($status -eq 'failed' -or ($required -eq $true -and $status -ne 'passed')) {
            $blockers.Add("required test is not passed: $testName")
        }
    }
}

$approvals = @(Get-PropertyValue -Object $release -Name 'approvals')
if ($approvals.Count -eq 0 -or $null -eq $approvals[0]) {
    $validationErrors.Add('$.approvals must be a non-empty array')
}
else {
    $approvedRequiredCount = 0
    for ($index = 0; $index -lt $approvals.Count; $index++) {
        $approval = $approvals[$index]
        if ($approval -isnot [pscustomobject]) {
            $validationErrors.Add("$.approvals[$index] must be an object")
            continue
        }
        $type = Require-Text -Object $approval -Name 'type' -Path "$.approvals[$index]"
        $null = Require-Text -Object $approval -Name 'owner' -Path "$.approvals[$index]"
        $status = Require-Text -Object $approval -Name 'status' -Path "$.approvals[$index]"
        $required = Get-PropertyValue -Object $approval -Name 'required'
        if ($required -isnot [bool]) { $validationErrors.Add("$.approvals[$index].required must be a boolean") }
        if ($status -and $status -notin @('approved', 'pending', 'rejected', 'not-required')) {
            $validationErrors.Add("$.approvals[$index].status is invalid")
        }
        if ($required -eq $true -and $status -eq 'approved') { $approvedRequiredCount++ }
        if ($required -eq $true -and $status -ne 'approved') {
            $blockers.Add("required approval is not approved: $type")
        }
    }
    if ($risk -in @('high', 'critical') -and $approvedRequiredCount -eq 0) {
        $blockers.Add("$risk risk release has no approved required approval")
    }
}

$deploymentPlan = Get-PropertyValue -Object $release -Name 'deployment_plan'
if ($deploymentPlan -isnot [pscustomobject]) {
    $validationErrors.Add('$.deployment_plan must be an object')
}
else {
    $null = Require-Text -Object $deploymentPlan -Name 'owner' -Path '$.deployment_plan'
    $steps = @(Get-PropertyValue -Object $deploymentPlan -Name 'steps')
    if ($steps.Count -eq 0 -or $null -eq $steps[0]) { $validationErrors.Add('$.deployment_plan.steps must be non-empty') }
}

$rollbackPlan = Get-PropertyValue -Object $release -Name 'rollback_plan'
if ($rollbackPlan -isnot [pscustomobject]) {
    $validationErrors.Add('$.rollback_plan must be an object')
}
else {
    $null = Require-Text -Object $rollbackPlan -Name 'owner' -Path '$.rollback_plan'
    $null = Require-Text -Object $rollbackPlan -Name 'trigger' -Path '$.rollback_plan'
    $tested = Get-PropertyValue -Object $rollbackPlan -Name 'tested'
    if ($tested -isnot [bool]) { $validationErrors.Add('$.rollback_plan.tested must be a boolean') }
    elseif ($environment -eq 'production' -and -not $tested) { $blockers.Add('production rollback plan is not tested') }
}

$healthChecks = @(Get-PropertyValue -Object $release -Name 'health_checks')
if ($healthChecks.Count -eq 0 -or $null -eq $healthChecks[0]) {
    $validationErrors.Add('$.health_checks must be a non-empty array')
}
else {
    for ($index = 0; $index -lt $healthChecks.Count; $index++) {
        $healthCheck = $healthChecks[$index]
        if ($healthCheck -isnot [pscustomobject]) {
            $validationErrors.Add("$.health_checks[$index] must be an object")
            continue
        }
        $null = Require-Text -Object $healthCheck -Name 'name' -Path "$.health_checks[$index]"
        $null = Require-Text -Object $healthCheck -Name 'threshold' -Path "$.health_checks[$index]"
        $null = Require-Text -Object $healthCheck -Name 'owner' -Path "$.health_checks[$index]"
    }
}

$communication = Get-PropertyValue -Object $release -Name 'communication'
if ($communication -isnot [pscustomobject]) {
    $validationErrors.Add('$.communication must be an object')
}
else {
    $null = Require-Text -Object $communication -Name 'owner' -Path '$.communication'
    $audiences = @(Get-PropertyValue -Object $communication -Name 'audiences')
    if ($audiences.Count -eq 0 -or $null -eq $audiences[0]) { $validationErrors.Add('$.communication.audiences must be non-empty') }
}

if ($validationErrors.Count -gt 0) {
    [Console]::Error.WriteLine(("INVALID release input:`n- " + ($validationErrors -join "`n- ")))
    exit 2
}
if ($blockers.Count -gt 0) {
    [Console]::Error.WriteLine(("BLOCKED release readiness:`n- " + ($blockers -join "`n- ")))
    exit 1
}

Write-Output "READY: release '$releaseName' passed deterministic structural readiness checks. Human approval and live evidence are still required."
exit 0
