# Change and Production Safety Rules
## Purpose
Control cloud actions capable of causing outages, data loss, security impact, or irreversible change.
## Scope
Production configuration, destructive actions, access changes, migrations, deployments, and emergency operations.
## MUST
- Analyze, recommend, prepare, and execute MUST be treated as distinct authority levels.
- Destructive or high-blast-radius production actions MUST require explicit human approval and a validated recovery strategy.
- Changes MUST define expected outcome, scope, verification, and rollback or recovery before execution when practical.
## MUST NOT
- MUST NOT destroy infrastructure, delete data, rotate critical secrets, weaken security, or execute irreversible migration without authorized approval.
- MUST NOT force-push or rewrite shared production-related history as an unapproved shortcut.
## SHOULD
- Prefer reversible, incremental, observable changes.
## Exceptions
Emergency execution must follow incident authority and be documented afterward.
## Verification
Inspect approvals, plans, diffs, audit logs, runbooks, recovery evidence, and post-change validation.