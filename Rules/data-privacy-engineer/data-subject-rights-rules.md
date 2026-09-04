# Data Subject Rights Rules

## Purpose
Ensure systems can reliably locate, export, correct, restrict, and delete personal data when approved rights requests require action.

## Scope
Applies to user-facing and internal workflows for access, correction, deletion, restriction, objection, portability, and identity verification.

## MUST
- Rights workflows MUST define identity-verification requirements appropriate to request sensitivity.
- Search and fulfillment MUST cover authoritative stores and material derived systems within the required scope.
- Request status, actions, exceptions, and completion evidence MUST be auditable.
- Fulfillment logic MUST distinguish data that can be changed or deleted from data subject to legitimate retention restrictions.
- Automated actions MUST be idempotent or safely retryable.

## MUST NOT
- Requests MUST NOT expose another person's data because of weak identity matching.
- A successful UI response MUST NOT be treated as proof that backend fulfillment completed.
- Legal or policy exceptions MUST NOT be invented by implementation code.

## SHOULD
- Systems SHOULD maintain machine-readable mappings between subject identifiers and data locations.
- Common requests SHOULD be automated while preserving exception review for ambiguous cases.

## Exceptions
Exceptions require documented basis, scope, approver, and evidence retained for the required audit period.

## Verification
Run representative end-to-end requests and inspect identity checks, search coverage, downstream actions, retries, audit records, and completion evidence.