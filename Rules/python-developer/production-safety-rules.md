# Production Safety Rules
## Purpose
Prevent unauthorized or irreversible production impact.
## Scope
Deployments, production data, configuration, migrations, and operational actions.
## MUST
- High-risk production actions MUST have explicit human approval before execution.
- Changes MUST define verification and rollback or recovery strategy when reversal is feasible.
- Destructive data operations and irreversible migrations MUST have reviewed scope and recovery evidence.
## MUST NOT
- MUST NOT force push shared protected history, delete production data, weaken security controls, or change production configuration without authorization.
- MUST NOT present preparation or recommendation as executed work.
## SHOULD
- Prefer reversible, staged, observable releases.
## Exceptions
Emergency procedures require established authority and post-action review.
## Verification
Approval record, deployment diff, recovery plan, audit trail, and post-change telemetry.