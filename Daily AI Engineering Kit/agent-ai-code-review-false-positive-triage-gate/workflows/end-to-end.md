# Workflow: AI Code Review False-Positive Triage Gate

## Trigger
An AI review finding is proposed as merge-blocking, remediation-worthy, or operationally significant.

## Entry conditions
Repository is readable, the finding identifies an affected area, and the task can be investigated non-destructively.

## Inputs
Finding claim, severity, repository root, changed diff/base, policy, available tests/specifications/runtime evidence.

## Context
Load changed files first, then nearby implementations/tests, then callers/contracts only when evidence requires expansion.

## Stages
1. **Preflight — Repository Explorer**: capture changed files with `scripts/check-review-diff.py`; validate policy availability.
2. **Claim normalization — Repository Explorer**: convert the review statement into a falsifiable proposition and identify exact locations.
3. **Evidence collection — Repository Explorer**: collect facts, hypotheses, and a minimal reproduction plan.
4. **Triage — Verification Agent**: reject directly disproven claims, confirm reproducible claims, or classify as `needs-human-review`.
5. **Remediation — Implementation Agent**: only for confirmed defects; implement the smallest safe fix and targeted tests.
6. **Post-edit checks — Implementation Agent**: run focused reproduction, relevant tests/build/static analysis, and inspect diff.
7. **Independent verification — Verification Agent**: rerun decisive checks and challenge both severity and remediation.
8. **Contract validation — Verification Agent**: run `scripts/validate-findings.py` against `config/triage-policy.json`.
9. **Complete or stop**: complete only when verification is evidence-based and approval boundaries are clear.

## Produced artifacts
- review diff JSON;
- one or more finding records compatible with `schemas/finding.schema.json`;
- command/test/build evidence;
- remediation diff when applicable.

## Checkpoints
- No merge-blocking classification before decisive evidence.
- No remediation before `status=confirmed`.
- No dangerous action without explicit human approval.
- No successful completion before independent verification.

## Retry rules
Maximum two implementation retries. Retryable failures are incorrect reproduction setup, deterministic test/build failures attributable to the proposed fix, or transient local tool failures. Preserve all failing command output and prior finding records. A third failure, permission failure, unavailable external evidence, or unresolved business intent stops the workflow and escalates to human review.

## Approval points
Stop for approval before production deployment/configuration, destructive SQL/data deletion, schema changes, infrastructure/secret changes, force push/history rewrite, breaking public contracts, security weakening, irreversible migrations, or large dependency upgrades.

## Failure paths
- **Validation failure:** stop and fix the record/policy, not the product code.
- **Build/test failure:** diagnose within the two-retry budget.
- **Tool failure:** retry once only when transient; otherwise stop with evidence.
- **Permission failure:** stop; never escalate privileges automatically.
- **Business-rule ambiguity:** classify `needs-human-review`.

## Definition of Done
The finding has a valid terminal status; blocking findings satisfy policy thresholds and independent verification; rejected findings contain direct contrary evidence; any remediation is scoped and tested; remaining risk is recorded; no approval-required action is pending; record validation passes.
