param(
  [string]$ProcessName,
  [int]$TargetPid = 0,
  [int]$DurationSeconds = 30,
  [double]$IntervalSeconds = 1,
  [Parameter(Mandatory=$true)][string]$ThresholdFile,
  [string]$OutputJson = "resource-report.json"
)
$ErrorActionPreference = 'Stop'
function Fail([string]$Message,[int]$Code){ Write-Error $Message; exit $Code }
if (($TargetPid -le 0) -and [string]::IsNullOrWhiteSpace($ProcessName)) { Fail 'Specify -TargetPid or -ProcessName.' 3 }
if ($DurationSeconds -lt 2 -or $IntervalSeconds -le 0) { Fail 'Invalid duration or interval.' 3 }
if (!(Test-Path -LiteralPath $ThresholdFile)) { Fail 'Threshold file not found.' 3 }
try { $t = Get-Content -Raw -LiteralPath $ThresholdFile | ConvertFrom-Json } catch { Fail "Invalid threshold JSON: $($_.Exception.Message)" 3 }
$required = 'maxMeanCpuPercent','maxPeakCpuPercent','maxSustainedCpuSamples','cpuSampleThresholdPercent','maxMeanReadBytesPerSecond','maxPeakReadBytesPerSecond','maxWorkingSetMb','maxProcessCount','maxPidChurn'
foreach($k in $required){ if($null -eq $t.$k){ Fail "Missing threshold: $k" 3 } }
function Get-Roots {
  if ($TargetPid -gt 0) { return @(Get-Process -Id $TargetPid -ErrorAction SilentlyContinue) }
  return @(Get-Process -Name $ProcessName -ErrorAction SilentlyContinue)
}
$roots = Get-Roots
if ($roots.Count -eq 0) { Fail 'Target process not found.' 4 }
$rootIds = @($roots.Id | ForEach-Object {[int]$_})
$samples = New-Object System.Collections.Generic.List[object]
$seenPids = New-Object 'System.Collections.Generic.HashSet[int]'
$previous = @{}
$sampleCount = [Math]::Floor($DurationSeconds / $IntervalSeconds)
for($i=0; $i -lt $sampleCount; $i++){
  try { $all = @(Get-CimInstance Win32_Process) } catch { Fail "Cannot read Win32_Process counters: $($_.Exception.Message)" 3 }
  $selected = New-Object 'System.Collections.Generic.HashSet[int]'
  foreach($id in $rootIds){ [void]$selected.Add($id) }
  $changed = $true
  while($changed){
    $changed = $false
    foreach($cp in $all){
      $id=[int]$cp.ProcessId; $parent=[int]$cp.ParentProcessId
      if($selected.Contains($parent) -and !$selected.Contains($id)){ [void]$selected.Add($id); $changed=$true }
    }
  }
  $cimById=@{}; foreach($cp in $all){ $cimById[[int]$cp.ProcessId]=$cp }
  $ids=@($selected); foreach($id in $ids){ [void]$seenPids.Add($id) }
  $cpuDelta=0.0; $readDelta=0.0; $writeDelta=0.0; $working=0.0
  foreach($id in $ids){
    if(!$cimById.ContainsKey($id)){ continue }
    $cp=$cimById[$id]
    $gp=Get-Process -Id $id -ErrorAction SilentlyContinue
    if($null -eq $gp){ continue }
    if($null -eq $cp.ReadTransferCount -or $null -eq $cp.WriteTransferCount -or $null -eq $cp.WorkingSetSize){ Fail "Missing Win32_Process counters for PID $id" 3 }
    $cpu=if($null -eq $gp.CPU){0.0}else{[double]$gp.CPU}
    $read=[double]$cp.ReadTransferCount; $write=[double]$cp.WriteTransferCount; $working += [double]$cp.WorkingSetSize
    if($previous.ContainsKey($id)){
      $cpuDelta += [Math]::Max(0,$cpu-$previous[$id].cpu)
      $readDelta += [Math]::Max(0,$read-$previous[$id].read)
      $writeDelta += [Math]::Max(0,$write-$previous[$id].write)
    }
    $previous[$id]=@{cpu=$cpu;read=$read;write=$write}
  }
  $samples.Add([pscustomobject]@{timestamp=(Get-Date).ToString('o');cpuPercent=[Math]::Round(($cpuDelta/$IntervalSeconds)*100,2);readBytesPerSecond=[Math]::Round($readDelta/$IntervalSeconds,0);writeBytesPerSecond=[Math]::Round($writeDelta/$IntervalSeconds,0);workingSetMb=[Math]::Round($working/1MB,2);processCount=$ids.Count})
  Start-Sleep -Milliseconds ([int]($IntervalSeconds*1000))
}
if($samples.Count -lt 1){ Fail 'No samples captured.' 3 }
$meanCpu=($samples|Measure-Object cpuPercent -Average).Average; $peakCpu=($samples|Measure-Object cpuPercent -Maximum).Maximum
$meanRead=($samples|Measure-Object readBytesPerSecond -Average).Average; $peakRead=($samples|Measure-Object readBytesPerSecond -Maximum).Maximum
$maxWs=($samples|Measure-Object workingSetMb -Maximum).Maximum; $maxProc=($samples|Measure-Object processCount -Maximum).Maximum
$sustained=@($samples|Where-Object {$_.cpuPercent -gt [double]$t.cpuSampleThresholdPercent}).Count
$churn=[Math]::Max(0,$seenPids.Count-$rootIds.Count)
$breaches=New-Object System.Collections.Generic.List[string]
if($meanCpu -gt [double]$t.maxMeanCpuPercent){$breaches.Add('mean_cpu')}; if($peakCpu -gt [double]$t.maxPeakCpuPercent){$breaches.Add('peak_cpu')}
if($sustained -gt [int]$t.maxSustainedCpuSamples){$breaches.Add('sustained_cpu')}; if($meanRead -gt [double]$t.maxMeanReadBytesPerSecond){$breaches.Add('mean_read_io')}
if($peakRead -gt [double]$t.maxPeakReadBytesPerSecond){$breaches.Add('peak_read_io')}; if($maxWs -gt [double]$t.maxWorkingSetMb){$breaches.Add('working_set')}
if($maxProc -gt [int]$t.maxProcessCount){$breaches.Add('process_count')}; if($churn -gt [int]$t.maxPidChurn){$breaches.Add('pid_churn')}
$report=[pscustomobject]@{status=if($breaches.Count){'fail'}else{'pass'};targetRootPids=$rootIds;durationSeconds=$DurationSeconds;intervalSeconds=$IntervalSeconds;summary=[pscustomobject]@{meanCpuPercent=[Math]::Round($meanCpu,2);peakCpuPercent=[Math]::Round($peakCpu,2);sustainedCpuSamples=$sustained;meanReadBytesPerSecond=[Math]::Round($meanRead,0);peakReadBytesPerSecond=[Math]::Round($peakRead,0);maxWorkingSetMb=[Math]::Round($maxWs,2);maxProcessCount=$maxProc;pidChurn=$churn};breaches=$breaches;samples=$samples}
$report|ConvertTo-Json -Depth 6|Set-Content -Encoding UTF8 -LiteralPath $OutputJson
if($breaches.Count){exit 2}; exit 0
