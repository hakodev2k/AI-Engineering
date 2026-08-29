# Exception and Risk Acceptance Rules

## Purpose
Ensure deviations from supply-chain controls are deliberate, bounded, reviewable, and temporary where possible.

## Scope
Applies to exceptions involving dependencies, registries, CI/CD, signing, provenance, vulnerabilities, access, release controls, and compliance requirements.

## MUST
- Every material exception MUST record the exact rule being bypassed, business reason, affected systems or artifacts, alternatives considered, residual risk, compensating controls, accountable owner, and approver.
- Time-sensitive exceptions MUST have an expiry or review date.
- High-risk exceptions affecting production releases, signing, privileged access, or integrity controls MUST require explicit human approval before execution.
- Expired exceptions MUST be removed, renewed with evidence, or escalated.

## MUST NOT
- MUST NOT use vague statements such as temporary need or low risk without supporting evidence.
- MUST NOT treat previous approval as permanent authorization for materially different circumstances.
- MUST NOT allow an automated agent to approve its own high-risk exception.

## SHOULD
- Exception volume and age SHOULD be monitored for systemic control gaps.
- Repeated exceptions SHOULD trigger architectural or process remediation rather than indefinite renewal.

## Exceptions
This policy itself MUST NOT be bypassed for material supply-chain risk acceptance. Emergency actions may proceed only under an authorized incident process with retrospective review.

## Verification
Inspect exception records, expiry dates, approvals, compensating-control evidence, and closure history. Confirm high-risk actions have independent human authorization and no expired exception remains active without review.