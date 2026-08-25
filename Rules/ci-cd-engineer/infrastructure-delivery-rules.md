# Infrastructure Delivery Rules

## Purpose
Make infrastructure changes reviewable, predictable, and recoverable.

## Scope
Infrastructure as code, plans, applies, policy checks, and production infrastructure changes.

## MUST
- Infrastructure changes MUST be represented as reviewed code except documented emergency procedures.
- Production apply MUST use a reviewed plan or equivalent preview tied to the exact revision being executed.
- Destructive infrastructure actions MUST require explicit human approval and recovery assessment.
- State and locking mechanisms MUST prevent concurrent unsafe mutation.
- Policy and security checks MUST run before privileged apply.

## MUST NOT
- MUST NOT apply a materially different plan than the one approved.
- MUST NOT bypass state locking to resolve routine contention.
- MUST NOT destroy shared or production resources solely to unblock a pipeline.

## SHOULD
- Infrastructure modules SHOULD be versioned and tested.
- Drift detection SHOULD identify out-of-band changes.

## Exceptions
Emergency manual changes require authorization, audit evidence, subsequent reconciliation into code, and verification.

## Verification
Compare plan/apply revisions, inspect state locking and backend controls, review policy results and approvals, and run drift detection after changes.