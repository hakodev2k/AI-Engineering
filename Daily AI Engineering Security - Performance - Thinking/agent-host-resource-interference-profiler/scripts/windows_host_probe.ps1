param(
  [Parameter(Mandatory=$true)][string]$Output,
  [string]$ProcessName = 'ChatGPT',
  [int]$DurationSeconds = 15,
  [int]$IntervalMs = 5
)
$ErrorActionPreference='Stop'
if ($DurationSeconds -lt 3 -or $DurationSeconds -gt 300) { throw 'DurationSeconds must be 3..300' }
if ($IntervalMs -lt 1 -or $IntervalMs -gt 1000) { throw 'IntervalMs must be 1..1000' }

# This probe is read-only. It measures scheduler wake-up gaps and process-family snapshots.
$gaps = New-Object System.Collections.Generic.List[double]
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$last = $sw.Elapsed.TotalMilliseconds
$end = $last + ($DurationSeconds * 1000)
while ($sw.Elapsed.TotalMilliseconds -lt $end) {
  Start-Sleep -Milliseconds $IntervalMs
  $now = $sw.Elapsed.TotalMilliseconds
  $gaps.Add([Math]::Max(0.0, $now - $last - $IntervalMs))
  $last = $now
}

$procs = @(Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -like "*$ProcessName*" })
$procSummary = [ordered]@{
  filter = $ProcessName
  count = $procs.Count
  total_cpu_seconds = [Math]::Round((($procs | Measure-Object CPU -Sum).Sum),3)
  working_set_bytes = [int64](($procs | Measure-Object WorkingSet64 -Sum).Sum)
  private_memory_bytes = [int64](($procs | Measure-Object PrivateMemorySize64 -Sum).Sum)
  ids = @($procs | Select-Object -ExpandProperty Id)
}
$result = [ordered]@{
  captured_at_utc = [DateTime]::UtcNow.ToString('o')
  host = $env:COMPUTERNAME
  duration_seconds = $DurationSeconds
  interval_ms = $IntervalMs
  gap_ms = @($gaps)
  process = $procSummary
}
$result | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 -Path $Output
Write-Output $Output
