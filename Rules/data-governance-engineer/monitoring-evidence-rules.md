# Monitoring and Evidence Rules
## Purpose
Make governance effectiveness observable and auditable.
## Scope
Governance controls, quality checks, access reviews, policy compliance, certification, and remediation.
## MUST
- Critical controls MUST produce durable evidence of execution, outcome, timestamp, and responsible system or actor.
- Monitoring MUST distinguish missing evidence from successful control execution.
- Governance conclusions MUST use available logs, metrics, lineage, scans, or equivalent operational evidence.
## MUST NOT
- Agent confidence, verbal assurance, or dashboard greenness alone MUST NOT be treated as proof of compliance.
- Evidence MUST NOT expose secrets or unnecessary sensitive data.
## SHOULD
- Evidence SHOULD be immutable or tamper-evident where risk warrants it.
## Exceptions
Manual evidence requires reviewer identity, source, date, scope, and validation method.
## Verification
Sample control executions end-to-end, validate evidence retention, integrity, completeness, and linkage to decisions.