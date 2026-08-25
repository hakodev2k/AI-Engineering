param(
  [Parameter(Mandatory=$true)][string]$ProcessName,
  [Parameter(Mandatory=$true)][string]$Scenario,
  [string]$Output = "agent-process-metrics.csv",
  [int]$IntervalSeconds = 2,
  [int]$Samples = 30
)
if ($IntervalSeconds -lt 1 -or $Samples -lt 2) { throw "IntervalSeconds >=1 and Samples >=2 required" }
$logical = [Environment]::ProcessorCount
$prev = @{}
$rows = @()
for ($i=0; $i -lt $Samples; $i++) {
  $now = Get-Date
  $procs = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
  if (-not $procs) { Write-Error "No process named '$ProcessName' found"; exit 2 }
  $cpu=0.0; $readDelta=0.0; $writeDelta=0.0; $ws=0.0; $handles=0; $threads=0
  foreach($p in $procs) {
    try {
      $pidValue=[int]$p.Id
      $cpuNow=[double]$p.CPU
      $io = Get-CimInstance Win32_Process -Filter "ProcessId=$pidValue" -ErrorAction SilentlyContinue
      $r=0.0; $w=0.0
      if ($io) { $r=[double]$io.ReadTransferCount; $w=[double]$io.WriteTransferCount }
      if ($prev.ContainsKey($pidValue)) {
        $dCpu=[Math]::Max(0.0,$cpuNow-$prev[$pidValue].cpu)
        $cpu += 100.0*$dCpu/$IntervalSeconds/$logical
        $readDelta += [Math]::Max(0.0,$r-$prev[$pidValue].read)
        $writeDelta += [Math]::Max(0.0,$w-$prev[$pidValue].write)
      }
      $prev[$pidValue]=@{cpu=$cpuNow;read=$r;write=$w}
      $ws += [double]$p.WorkingSet64/1MB
      $handles += [int]$p.HandleCount
      $threads += [int]$p.Threads.Count
    } catch { }
  }
  $rows += [pscustomobject]@{
    timestamp=$now.ToString("o"); scenario=$Scenario; process_name=$ProcessName
    process_count=$procs.Count; cpu_percent=[Math]::Round($cpu,3)
    read_mb_s=[Math]::Round($readDelta/1MB/$IntervalSeconds,3)
    write_mb_s=[Math]::Round($writeDelta/1MB/$IntervalSeconds,3)
    working_set_mb=[Math]::Round($ws,3); handles=$handles; threads=$threads; input_stall_ms=""
  }
  if ($i -lt $Samples-1) { Start-Sleep -Seconds $IntervalSeconds }
}
$rows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $Output
Write-Host "Wrote $($rows.Count) samples to $Output"
