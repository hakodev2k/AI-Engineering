# Migration Strategy

## Purpose
Define safe, evidence-based strategies for changing production data systems.

## Scope
Applies to schema, engine, topology, platform, and data-movement migrations.

## MUST
- Every migration MUST define source, target, invariants, dependencies, acceptance criteria, rollback or forward-recovery path, and accountable approvers.
- Strategy MUST classify changes by reversibility, blast radius, downtime tolerance, data volume, and consistency requirements.
- High-risk assumptions MUST be validated with representative rehearsal evidence before production execution.

## MUST NOT
- MUST NOT treat a successful schema change as proof that data, applications, and integrations remain correct.
- MUST NOT execute an irreversible migration without explicit human approval and a tested recovery plan.

## SHOULD
- Prefer incremental, observable, reversible stages over big-bang cutovers.
- Prefer strategies that allow old and new paths to coexist until validation completes.

## Exceptions
Exceptions require documented context, alternatives, risk, evidence, verification, and approval proportional to blast radius.

## Verification
Review the migration plan, dependency inventory, rehearsal results, recovery evidence, acceptance criteria, and approvals before execution.