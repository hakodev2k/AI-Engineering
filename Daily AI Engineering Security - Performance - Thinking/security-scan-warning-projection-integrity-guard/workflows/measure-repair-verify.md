# Workflow — Measure, Repair, Verify Warning Projection

## Trigger
A security scanner/exporter is introduced or changed, or warning loss is suspected.

## Goal
Preserve canonical execution warnings across all required machine-readable outputs without changing warning semantics.

## Inputs
Canonical scan result/event stream, projection artifacts, policy, source code, test fixtures.

## Baseline
Capture canonical warning count and preservation ratio for each projection before modification.

## Stages
1. **Observe** — reproduce a warning-producing scan and a clean control run.
2. **Measure baseline** — fingerprint canonical warnings and compare all projections.
3. **Diagnose** — identify the first boundary that drops each missing warning.
4. **Form hypothesis** — state the expected data-flow correction and affected serializers/observers.
5. **Implement** — make the smallest non-destructive projection change.
6. **Measure again** — run the same fixtures and verifier.
7. **Independent verification** — Security Evidence Verifier checks artifacts and diff.
8. **Complete** — publish evidence only when all required ratios equal 1.0.

## Responsible agent
Implementation owner for stages 1–6; `security-evidence-verifier` for stage 7.

## Tools
Scanner CLI, fixture runner, schema validator, `scripts/verify_warning_projection.py`, source-control diff.

## Outputs
Baseline report, diagnosis, patch, after-report, independent verdict.

## Checkpoints
- Baseline exists before code changes.
- Canonical source is demonstrably warning-complete.
- Each implementation attempt has one explicit hypothesis.
- Clean-run regression remains clean.

## Metrics
Warning preservation ratio, missing/orphan warning count, schema-valid rate, clean-run false-warning count.

## Retry policy
Maximum 2 implementation retries after the baseline. A retry requires new evidence or a revised hypothesis.

## Stop conditions
Stop successfully only when all required projections preserve all canonical warnings and schemas/tests pass. Stop unsuccessfully after two failed repair attempts or if canonical warning capture itself is unreliable.

## Failure path
Block the affected projection from authoritative automated gating; preserve raw canonical artifacts; escalate with exact missing fingerprints and boundary evidence.

## Verification
Independent verifier must reproduce the final comparison from persisted artifacts.

## Definition of Done
Implemented: warning transport exists. Measured: before/after matrices are captured. Verified: independent comparison shows 100% preservation, no false warnings, valid schemas, and no blocking issue.