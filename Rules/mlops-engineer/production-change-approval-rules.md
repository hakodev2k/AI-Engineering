# Production Change Approval Rules

## Purpose
Keep automated agents and engineers within explicit authority boundaries for high-impact ML production changes.

## Scope
Applies to production deployments, data deletion, infrastructure destruction, access changes, secret rotation, security weakening, irreversible migrations, and breaking model/API contracts.

## MUST
- Work MUST distinguish analysis, recommendation, preparation, and execution.
- Production deployment, destructive data operations, infrastructure destruction, high-risk access changes, secret rotation, breaking public contracts, and weakening security controls MUST require explicit human authorization when not already covered by a pre-approved controlled procedure.
- Approval requests MUST identify intended change, scope, risk, evidence, rollback/recovery plan, and verification.
- Automated execution MUST enforce environment and permission boundaries technically where practical.
- Executed changes MUST produce an audit record.

## MUST NOT
- An AI agent MUST NOT infer permission to execute a dangerous action from permission to analyze or prepare it.
- Approval MUST NOT be treated as permanent authorization for materially different scope.
- Force push or history rewriting MUST NOT be used on shared protected history without explicit authority.

## SHOULD
- High-risk changes SHOULD use two-person review or equivalent separation of duties.
- Reversible alternatives SHOULD be preferred.

## Exceptions
Emergency authority MUST be explicit, time-bounded, auditable, and followed by review.

## Verification
Inspect IAM/pipeline gates, approval records, change tickets or equivalent evidence, audit logs, environment protections, and rollback verification.