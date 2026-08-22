# Security Monitoring Rules
## Purpose
Detect and investigate security-relevant activity across AWS workloads.
## Scope
CloudTrail, Config, GuardDuty, Security Hub, Access Analyzer, findings, and audit evidence.
## MUST
- Enable auditable control-plane activity for governed accounts and protect the audit trail from unauthorized modification.
- Assign severity, owner, and response expectations to actionable security findings.
- Centralize or otherwise preserve security evidence so compromise of one workload cannot silently erase it.
- Investigate material findings using source evidence before closure.
## MUST NOT
- Suppress recurring findings without documented root cause or accepted risk.
- Treat scanner silence as proof that a system is secure.
## SHOULD
- Automate enrichment and routing while retaining human approval for destructive remediation.
## Exceptions
Suppression requires rationale, scope, expiry/review, evidence, and accountable approval.
## Verification
Inspect trail coverage, Config/security service status, finding workflow, retention, suppression records, and incident evidence.