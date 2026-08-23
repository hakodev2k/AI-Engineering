$ErrorActionPreference='Stop'
$root=Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$script=Join-Path $root 'scripts/windows_resource_probe.ps1'; $threshold=Join-Path $root 'config/thresholds.example.json'
if(!(Test-Path $script)){throw 'probe script missing'}; if(!(Test-Path $threshold)){throw 'threshold file missing'}
$t=Get-Content -Raw $threshold|ConvertFrom-Json
$required='maxMeanCpuPercent','maxPeakCpuPercent','maxSustainedCpuSamples','cpuSampleThresholdPercent','maxMeanReadBytesPerSecond','maxPeakReadBytesPerSecond','maxWorkingSetMb','maxProcessCount','maxPidChurn'
foreach($k in $required){if($null -eq $t.$k){throw "missing threshold $k"}}
& $script -ProcessName '__definitely_missing_ai_probe_target__' -DurationSeconds 2 -IntervalSeconds 1 -ThresholdFile $threshold -OutputJson (Join-Path $env:TEMP 'missing-target.json') 2>$null
if($LASTEXITCODE -ne 4){throw "expected missing target exit 4, got $LASTEXITCODE"}
$temp=Join-Path $env:TEMP 'ai-probe-thresholds.json'; $out=Join-Path $env:TEMP 'ai-probe-self.json'
@{maxMeanCpuPercent=100000;maxPeakCpuPercent=100000;maxSustainedCpuSamples=999;cpuSampleThresholdPercent=100000;maxMeanReadBytesPerSecond=1e18;maxPeakReadBytesPerSecond=1e18;maxWorkingSetMb=1e9;maxProcessCount=9999;maxPidChurn=9999}|ConvertTo-Json|Set-Content $temp
& $script -TargetPid $PID -DurationSeconds 2 -IntervalSeconds 1 -ThresholdFile $temp -OutputJson $out
if($LASTEXITCODE -ne 0){throw "self probe expected pass, got $LASTEXITCODE"}
$r=Get-Content -Raw $out|ConvertFrom-Json; if($r.status -ne 'pass' -or $r.samples.Count -lt 1){throw 'invalid report contract'}
Remove-Item $temp,$out -ErrorAction SilentlyContinue; Write-Host 'PASS: probe contract'
