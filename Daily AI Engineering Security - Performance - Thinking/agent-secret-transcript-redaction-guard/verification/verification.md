# Verification

## Verification model
Status is tracked separately as **Implemented**, **Measured**, and **Verified**.

### Implemented
A deterministic sanitizer and command preflight are wired into the intended host/tool pipeline and fail closed on internal errors.

### Measured
The same synthetic fixture set is run before and after integration. Metrics capture boundary coverage, mask counts, residuals and false positives without storing fixture values.

### Verified
An independent reviewer confirms the real model/transcript sinks receive only sanitized output and that no critical path bypasses the guard.

## Required test matrix
| Path | Required evidence | Pass condition |
|---|---|---|
| stdout | synthetic token emitted by test tool | token absent downstream |
| stderr | synthetic token emitted on stderr | token absent downstream |
| structured error | fake credential inside error field | sanitized field remains schema-valid |
| retry/replay | same fake result delivered twice | both deliveries sanitized |
| model context | captured assembled model input using fake canary | canary absent |
| local transcript | persisted synthetic session | canary absent |
| remote/log adapter | synthetic event through adapter | canary absent or adapter receives only sanitized event |
| sanitizer failure | deliberately invalid policy in isolated test | raw output not forwarded |
| command preflight | `printenv`/direct fake secret variable reference | blocked |

## Quantitative gates
- critical boundary coverage: 100%;
- registered exact-secret residuals: 0;
- configured high-confidence pattern residuals: 0;
- raw-pass-through-on-sanitizer-failure: 0;
- high-risk command preflight detection: 100% for configured fixtures;
- security diagnostics containing fixture values: 0;
- false-positive threshold: explicitly defined by the integrating team and measured on representative non-secret logs before production expansion of heuristic patterns.

## Test command
Run from topic root:

`python tests/run_tests.py`

This validates the reference scripts with synthetic credentials. Host-specific integration tests are still required because a passing standalone script does not prove correct placement in the runtime pipeline.

## Evidence checklist
- [ ] Public research sources documented.
- [ ] Boundary map completed.
- [ ] Baseline using fake credentials captured.
- [ ] Sanitizer wired before model and persistence sinks.
- [ ] Preflight wired for shell commands where available.
- [ ] Standalone regression suite passes.
- [ ] Host-specific stdout/stderr/structured-output tests pass.
- [ ] Transcript and model-bound artifacts independently inspected with fake canaries.
- [ ] Failure path proves no raw fallback.
- [ ] False-positive sample measured.
- [ ] Incident/recovery path documented.
- [ ] Independent reviewer completed final verification.

## Failure policy
Maximum two fix/retest iterations for the same integration defect. If a critical output path still cannot be sanitized safely, quarantine or disable that tool path and escalate. Do not weaken residual detection, sandboxing, transcript verification or secret boundaries to claim success.

## Definition of Done
The package is production-verified only when all critical paths in the matrix pass, quantitative gates are met, risks and false positives are recorded, no plaintext fixture secrets occur in diagnostics, and an independent verifier confirms the boundary placement.
