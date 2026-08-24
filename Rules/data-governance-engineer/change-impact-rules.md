# Change Impact Rules
## Purpose
Prevent data changes from causing unassessed semantic, operational, or compliance harm.
## Scope
Schema, definition, source, transformation, classification, ownership, retention, and policy changes.
## MUST
- Material changes MUST identify affected assets, consumers, controls, contracts, and obligations before execution.
- High-risk changes MUST define verification and rollback or forward-recovery strategy.
- Stakeholders MUST receive actionable notice before incompatible changes take effect.
## MUST NOT
- Governance-impacting production changes MUST NOT be executed solely on agent confidence or undocumented assumptions.
- Irreversible or breaking changes MUST NOT execute without required human approval.
## SHOULD
- Automated lineage and dependency analysis SHOULD inform impact assessment.
## Exceptions
Emergency changes require bounded scope, approval, evidence capture, and retrospective assessment.
## Verification
Review change records, dependency evidence, approvals, communications, validation results, and recovery plans.