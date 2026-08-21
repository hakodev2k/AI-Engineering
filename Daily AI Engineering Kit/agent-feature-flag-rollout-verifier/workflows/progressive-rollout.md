# Workflow: Progressive Feature-Flag Rollout

## Trigger
A feature is ready to be exposed through a feature flag or an existing flag exposure must be increased.

## Entry conditions
- Flag key and environment are known.
- Flag-off and flag-on code paths are locatable.
- Relevant tests can run.
- Telemetry or equivalent correctness evidence is available.

## Inputs
Change request, flag metadata, repository context, target cohort, requested rollout stages, acceptance criteria.

## Context
Repository files/tests, flag provider state, deployment version, observability data, business invariants, approval records.

## Stages
1. **Discover** — Rollout Planner maps evaluation sites and affected dependencies.
2. **Plan** — Planner writes a rollout contract and risk classification.
3. **Preflight** — Run validation, build/tests, and verify rollback readiness.
4. **Approval gate** — Human approval is required for production enablement and policy-defined boundaries.
5. **Canary** — Operator applies the approved initial exposure; the agent never silently changes production state.
6. **Observe** — Rollout Verifier gathers fresh evidence and evaluates guardrails.
7. **Decision** — `pass` permits only the next declared stage; `fail` requires rollback; `inconclusive` blocks expansion.
8. **Expand** — Repeat Observe/Decision for each explicitly declared stage.
9. **Finalize** — Verify full target exposure, preserve evidence, and mark `verified`.

## Tools
Repository search/read, build/test tools, `scripts/validate-rollout.py`, read-only telemetry/provider APIs, human-operated or explicitly approved provider write action.

## Produced artifacts
- Rollout contract.
- Test/build evidence.
- Baseline and stage telemetry snapshots.
- Verification record for each stage.
- Approval record where required.

## Checkpoints
- Contract validates before any rollout.
- Both branches pass required tests.
- Baseline exists before canary.
- Current provider state matches expected state before each decision.
- Guardrails pass before expansion.

## Retry rules
Maximum 2 retries per stage for transient tool/telemetry failures. Preserve failed output. Validation or guardrail failures are not retryable without a changed input, new evidence, or code/config correction.

## Stop conditions
Stop on missing approval, breached rollback threshold, unexpected provider state, failed required test, missing rollback path, security-control bypass, or 2 repeated transient failures.

## Approval points
Explicit approval is mandatory for production enablement, expansion above 25%, security-sensitive paths, breaking-contract paths, or irreversible data paths.

## Failure paths
- Guardrail breach → status `rolled-back` after approved/operator rollback, then verify restoration.
- Inconclusive evidence → status `blocked`; do not expand.
- Permission/tool failure → preserve evidence, retry twice if transient, then escalate.
- Rollback failure → stop all progression and escalate as high severity.

## Definition of Done
The target exposure is reached, every rollout stage has passing evidence, final provider state matches the contract, rollback readiness was proven, required approvals are recorded, no guardrail is breached, and final status is `verified`.
