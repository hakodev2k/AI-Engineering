# Security Exception Rules

## Purpose
Prevent supply-chain security exceptions from becoming permanent, invisible reductions in assurance.

## Scope
Policy waivers for dependencies, vulnerabilities, signing, provenance, registries, CI/CD controls, and release gates.

## MUST
- Every exception MUST identify the exact control being waived, affected component or artifact, business reason, risk, owner, approver, and expiry.
- Exceptions MUST define compensating controls and verification evidence where feasible.
- High-risk exceptions MUST require approval independent from the implementation owner.
- Expired exceptions MUST block continued reliance on the waiver until explicitly renewed.
- Repeated exceptions for the same control MUST trigger root-cause review and remediation planning.

## MUST NOT
- MUST NOT create blanket waivers covering unrelated repositories, artifacts, or vulnerabilities without explicit scoped justification.
- MUST NOT approve exceptions based solely on delivery pressure.
- MUST NOT silently convert temporary exceptions into permanent policy changes.

## SHOULD
- Exception duration SHOULD be as short as practical and tied to a concrete remediation milestone.
- Exception records SHOULD be machine-queryable and linked to release evidence.

## Exceptions
This rule itself MUST NOT be bypassed without explicit senior security and accountable business approval.

## Verification
Inspect waiver records for scope, expiry, approvals, compensating controls, renewal history, and evidence that expired waivers are rejected.