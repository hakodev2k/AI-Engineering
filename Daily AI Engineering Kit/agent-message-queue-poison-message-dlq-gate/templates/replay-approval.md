# DLQ Replay Approval

## Request
- Queue/topic:
- DLQ:
- Message IDs:
- Correlation IDs:
- Requested batch size:
- Current build/version:
- Message schema version:

## Evidence
- Original failure classification:
- Root-cause evidence:
- Fix commit/build:
- Regression test result:
- Independent verification result:
- Idempotency/duplicate-side-effect evidence:

## Risk
- Expected downstream effects:
- Rollback/containment action if replay fails:
- Residual risks:

## Approval
- Decision: APPROVED / REJECTED
- Approver:
- Approval timestamp:
- Approved batch limit:
- Additional constraints:

Production replay must not begin unless Decision is `APPROVED`, the approver is a human authorized for the affected system, and the requested batch does not exceed the approved batch limit or `config/policy.yaml`.
