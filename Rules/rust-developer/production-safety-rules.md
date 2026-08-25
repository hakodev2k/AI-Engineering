# Production Safety

## Purpose
Prevent unauthorized, irreversible, or poorly controlled changes to production systems and data.

## Scope
Deployments, migrations, configuration, destructive operations, emergency actions, and rollback.

## MUST
- Production-impacting changes MUST have defined verification and rollback or containment strategy.
- Destructive data operations, irreversible migrations, secret rotation, security weakening, and breaking public contracts MUST require explicit human approval before execution.
- Analyze, recommend, prepare, and execute authority MUST be distinguished; automation MUST NOT exceed granted authority.
- High-risk changes MUST identify blast radius and recovery evidence before execution.

## MUST NOT
- MUST NOT force push or rewrite shared history without explicit approval and repository policy allowance.
- MUST NOT perform destructive production actions based only on agent confidence.
- MUST NOT conceal failed or partial production changes.

## SHOULD
- Prefer reversible, incremental, observable changes with canaries or staged rollout where appropriate.
- Automate preflight and post-change verification.

## Exceptions
Emergency response may compress process only under authorized incident procedures with contemporaneous audit evidence.

## Verification
Inspect approvals, deployment logs, diffs, rollback tests, production telemetry, audit trails, and post-change health checks.