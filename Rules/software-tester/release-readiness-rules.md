# Release Readiness Rules

## Purpose
Provide transparent quality evidence for release decisions without exceeding tester authority.
## Scope
Release candidates, go/no-go assessment, residual risk, and sign-off inputs.
## MUST
- Report executed scope, results, blocked tests, unresolved defects, residual risks, and confidence limitations.
- Map critical exit criteria to evidence before recommending readiness.
- Escalate material unknowns rather than converting them into implied passes.
## MUST NOT
- Declare a release safe solely because planned tests passed.
- Conceal known risk to meet a deadline.
- Execute production deployment unless explicitly authorized for that responsibility.
## SHOULD
- Make release recommendations risk-based and distinguish recommendation from approval.
## Exceptions
Emergency releases require explicit acceptance of reduced evidence by the authorized decision owner.
## Verification
Review release report, exit criteria, defect state, blocked coverage, approvals, and residual-risk record.