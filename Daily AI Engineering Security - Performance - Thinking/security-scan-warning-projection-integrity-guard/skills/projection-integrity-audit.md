# Skill — Projection Integrity Audit

## Purpose
Determine whether execution warnings emitted by a security scanner survive every machine-readable projection used by automation.

## Trigger
Run after scan completion, exporter changes, SARIF schema changes, bulk-scan changes, or any incident where human CLI output disagrees with CI/archive output.

## Inputs
Canonical scan result/event log, SARIF output, bulk receipt/ledger, supported projection list, warning policy.

## Preconditions
The canonical source must be captured before projection and must distinguish findings from run warnings.

## Required context
Scanner version, target identity, scan start/end state, exporter versions, and CI consumer requirements.

## Allowed tools
Read-only repository inspection, JSON/SARIF parsers, schema validators, deterministic comparison scripts, test runners.

## Constraints
Do not mutate scan results while measuring the baseline. Do not infer missing warnings from findings. Do not expose secrets in diagnostic artifacts.

## Procedure
1. Capture the canonical warning set and assign each warning a stable fingerprint.
2. Record a baseline matrix: canonical, CLI/JSON, SARIF, bulk receipt, campaign summary.
3. Validate each projection structurally using its declared schema.
4. Run `python scripts/verify_warning_projection.py <canonical.json> <projection...>`.
5. For each missing warning, trace the first pipeline boundary where it disappears: producer → result object → observer → serializer → projection → consumer.
6. Form one hypothesis per loss boundary; prefer data-flow explanations over model speculation.
7. Implement the smallest change that makes warnings first-class at that boundary.
8. Re-run fixtures for warning-free, single-warning, multiple-warning, drift, and malformed-output cases.
9. Independently verify that ordinary findings and clean scans are unchanged.

## Decision points
- If canonical warning capture is incomplete, stop: projection verification is not meaningful.
- If schema is invalid, classify as projection failure before semantic comparison.
- If warning is intentionally unsupported by a projection, the policy must explicitly mark that projection non-authoritative for unattended security gating.

## Expected output
A before/after preservation matrix, root cause, changed boundary, verifier output, and residual risks.

## Metrics
100% required warning preservation, zero missing warning fingerprints, zero false warning invention, schema-valid outputs.

## Verification
An independent verifier must compare canonical and projected warning sets after implementation.

## Failure handling
Retry implementation/measurement at most twice. If warning preservation still fails, block the affected projection from being treated as authoritative and escalate with exact missing fingerprints.

## Stop conditions
Stop when all required projections preserve 100% of canonical warnings and regression fixtures pass, or when two repair attempts fail.