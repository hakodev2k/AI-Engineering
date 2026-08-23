# Windows Desktop Resource Regression Gate

**Category:** Performance

## Problem
Recent Windows desktop builds of AI coding clients can enter idle or semi-idle states that consume a full CPU core, generate extreme disk reads, repeatedly respawn MCP/native-host processes, and degrade system-wide keyboard/mouse latency. The defect is operationally dangerous because the agent can appear idle while harming the host machine.

## Evidence
See `evidence/research.md` for current August 2026 reports and source links.

## Proposed improvement
Treat desktop resource health as a release/runtime SLO, not a subjective UI complaint. Capture a quiet baseline, sample the target process tree and host resource signals, compare against thresholds, and fail the gate when sustained idle CPU, read I/O, memory, process churn, or related host-impact regressions exceed policy.

## Architecture
- `skills/resource-regression-investigation.md`
- `rules/performance-gate.md`
- `subagents/performance-investigator.md`
- `workflows/baseline-diagnose-verify.md`
- `hooks/pre-release-resource-gate.md`
- `scripts/windows_resource_probe.ps1`
- `tests/test-probe-contract.ps1`
- `config/thresholds.example.json`

## Installation
Requires Windows PowerShell 5.1+ or PowerShell 7+. No external modules are required.

## Configuration
Copy `config/thresholds.example.json` and tune only after measuring a known-good version on representative hardware. Thresholds are guardrails, not universal vendor claims.

## Usage
```powershell
pwsh ./scripts/windows_resource_probe.ps1 -ProcessName ChatGPT -DurationSeconds 30 -IntervalSeconds 1 -ThresholdFile ./config/thresholds.example.json -OutputJson ./resource-report.json
```

Exit codes: `0` pass, `2` threshold violation, `3` invalid input/runtime error, `4` target process not found.

## Workflow
Measure a quiet baseline on a known-good build, reproduce the suspect state, collect the same metrics, attribute load to process descendants and churn, form a single hypothesis, change one variable, then measure again. Maximum diagnostic retries: 3.

## Metrics
Mean/peak process-tree CPU, read/write bytes/sec, working-set MB, process count, PID churn, sustained threshold breaches.

## Verification
A fix is **Implemented** when code/config changes exist; **Measured** when before/after reports use the same sampling contract; **Verified** only when the suspect build returns below policy thresholds for the required sustained window and tests pass.

## Safety
The probe is read-only. It MUST NOT kill processes, change Defender settings, disable integrations, alter power plans, or weaken security controls to obtain a passing result.

## Failure handling
If the process disappears, measurement is inconclusive rather than passing. Missing counters are errors, never implicit zeroes.

## Definition of Done
Evidence documented; baseline captured; suspect run captured; bottleneck attributed; bounded remediation attempted; before/after metrics compared; probe tests pass; no security control disabled; no blocking threshold remains.
