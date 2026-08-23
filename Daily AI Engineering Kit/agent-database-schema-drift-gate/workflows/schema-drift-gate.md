# Workflow: Schema Drift Gate

## Trigger
A change may alter persistent database schema.

## Entry conditions
Repository and task intent are available; database provider/tooling is identifiable; investigation can run without production writes.

## Inputs
Acceptance criteria, repository state, baseline/candidate snapshots or commands capable of producing them.

## Stages
1. **Context — Schema Investigator:** locate models, mappings, migrations, provider config, tests; record tool/provider versions.
2. **Baseline:** capture trusted pre-change schema or derive it from migration history in a disposable environment.
3. **Candidate:** capture final proposed schema using the same representation.
4. **Deterministic diff:** run `scripts/schema_drift.py` and preserve report.
5. **Investigation — Schema Investigator:** classify each finding and trace cause/evidence.
6. **Correction:** implementation owner fixes unintended drift using smallest safe change.
7. **Retry checkpoint:** recapture candidate and rerun. Maximum two fix/retest cycles. Preserve all prior reports/output.
8. **Approval checkpoint:** stop for explicit human approval if any destructive/high-risk intended change remains. Approval must identify the reviewed change.
9. **Verification — Verification Agent:** independently reproduce diff, inspect final Git diff/generated SQL, run relevant tests/build.
10. **Complete:** emit verified artifacts and remaining non-blocking risks.

## Produced artifacts
Baseline snapshot, candidate snapshot, JSON drift report, investigation findings, build/test evidence, approval evidence when required, final verification result.

## Retry rules
Transient export/tool failure: maximum 2 retries. Build/test failure after a correction: maximum 2 fix/retest cycles. Policy failure with unchanged inputs is not retryable. Permission failure is not retryable.

## Failure paths
Invalid snapshot -> stop and repair evidence. Unexplained destructive drift -> escalate. Missing approval -> blocked. Production-only access -> stop. Verification mismatch -> return to investigation if retry budget remains, otherwise escalate.

## Stop conditions
Retry budget exhausted; required evidence unavailable; permission blocked; approval denied/missing; production mutation would be required to continue.

## Definition of Done
Final deterministic report is reproducible; all drift is intended or removed; approval-bound changes have exact approval; relevant build/tests pass; independent verifier returns `verified`; no blocking risk remains.
