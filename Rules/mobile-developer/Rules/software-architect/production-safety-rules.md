# Production Safety Rules

## Purpose
Control architectural actions that can materially affect production systems, data, security, or public contracts.

## Scope
Applies to production deployment, destructive data changes, infrastructure-impacting changes, high-risk access, irreversible migrations, and emergency actions.

## MUST
- High-risk production actions MUST distinguish analysis, recommendation, preparation, and execution authority.
- Destructive or irreversible actions MUST require explicit human approval and verified recovery safeguards.
- Production changes MUST define expected impact, verification evidence, and rollback or forward-fix strategy.
- Breaking public contracts, security weakening, secret rotation, destructive SQL, infrastructure destruction, and history rewriting MUST require explicit approval when relevant.

## MUST NOT
- MUST NOT silently execute actions beyond granted authority.
- MUST NOT disable monitoring or security controls to make a risky change appear successful.
- MUST NOT treat agent confidence as sufficient evidence for production safety.

## SHOULD
- Prefer reversible, staged, observable changes with limited blast radius.
- Prefer rehearsed procedures for high-impact operations.

## Exceptions
Emergency actions may shorten normal gates only with accountable human authorization, bounded scope, evidence capture, and mandatory follow-up review.

## Verification
Review approvals, change records, deployment telemetry, rollback evidence, audit logs, incident records, and post-change validation.