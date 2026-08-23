# Hook: Pre-release Resource Gate

## Trigger
Before promoting a Windows desktop build after a resource-sensitive change or known regression.

## Preconditions
Target app is started in the intended state; threshold file is approved; duration is configured.

## Action
Run `scripts/windows_resource_probe.ps1` and persist JSON evidence.

## Command
```powershell
pwsh ./scripts/windows_resource_probe.ps1 -ProcessName ChatGPT -DurationSeconds 60 -IntervalSeconds 1 -ThresholdFile ./config/thresholds.example.json -OutputJson ./resource-report.json
```

## Expected result
Exit `0` and `status: pass`.

## Failure behavior
Exit `2` blocks promotion. Exit `3` or `4` is inconclusive/error and also blocks promotion until measurement is valid.

## Blocks completion
Yes.
