# Verification Report

## Status model
This package distinguishes **Implemented**, **Measured**, and **Verified**.

## Implemented
The package contains:
- current public evidence and existing-solution analysis;
- wait policy with bounded backoff/wait limits;
- actionable skills and enforceable rules;
- separated investigator/implementer/verifier roles;
- bounded workflows and failure paths;
- hooks for pre-wait validation, brokerage, metrics, and release gating;
- executable deterministic broker and metrics scripts;
- regression tests and a sample trace;
- integration guidance.

## Static verification
Reviewed package properties:
- invalid/no-op targets are rejected;
- terminal states are explicit;
- material progress has a deterministic threshold;
- unchanged state does not itself create a broker wake event;
- polling backoff and maximum wait are bounded;
- provider failure returns an explicit error;
- metrics classification excludes turns that contain an actual decision/action;
- security/approval boundaries are not weakened.

## Runtime verification commands
From the package root:

```bash
python -m unittest discover -s tests -v
python scripts/wait_metrics.py examples/sample-trace.jsonl --json-out /tmp/wait-metrics.json
```

Integration environments should additionally run long-build, long-test, and long-subagent fixtures with real telemetry.

## Measured gates
For a representative target class, record before and after:
1. total model turns;
2. wait-only model turns;
3. total input tokens;
4. wait-only input tokens;
5. wait/status tool calls;
6. host-side polls;
7. completion-detection lag;
8. missed terminal/cancellation events;
9. broker error rate.

## Verified gate
Mark production behavior Verified only when all are true:
- wait-only model turns decrease by at least 80% for qualifying long-running fixtures;
- wait-only input token volume decreases by at least 80% when token telemetry is available;
- zero terminal/failure/cancellation events are missed in verification fixtures;
- invalid/no-op targets fail immediately instead of looping;
- completion-detection lag stays within the configured SLA;
- user input interrupts waiting correctly;
- no required approval/security boundary is bypassed;
- independent verifier reviews the evidence.

## Expected failure tests
- missing target ID → validation failure;
- `noop` target → validation failure;
- malformed state file → explicit error;
- repeated provider read failures → bounded `broker_error`;
- unchanged state → host polling/backoff only;
- progress below threshold → no model wake;
- material progress → one wake;
- completed/failed/cancelled → one terminal wake;
- maximum wait exceeded → deadline wake.

## Performance interpretation
A lower host poll count is useful but secondary. The principal optimization is eliminating model inference when no new state exists. A broker may perform several inexpensive state checks while still being successful if those checks replace expensive LLM turns and remain within CPU/network budgets.

## Definition of Done
- evidence documented;
- baseline captured from a real workload;
- current polling limitation documented;
- broker integrated for at least one target class;
- deterministic tests pass;
- before/after metrics collected;
- ≥80% wait-only inference reduction target met or an explicit alternative threshold is approved with evidence;
- detection SLA met;
- no missed terminal/cancellation events;
- rollback path tested;
- independent verification complete;
- no blocking issue remains.

## Current package verification claim
The reusable implementation and verification procedure are present and internally consistent. Real production savings are **not** claimed by this repository package alone; they require host integration and before/after telemetry.