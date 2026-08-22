# Lifecycle Hooks

- **before_task**: validate scope, owner, assets, deadline, approval needs; reject missing critical context as explicit unknown.
- **after_planning**: ensure trust boundaries, evidence plan, parallelizable reviews, and stop conditions exist.
- **before_privileged_action**: require named human approval and rollback/impact statement.
- **before_security_gate**: validate risk register has evidence, owner, remediation, residual risk, and verification status.
- **after_remediation**: route critical/high fixes to Security Verifier.
- **after_failed_verification**: increment bounded retry counter; after two cycles escalate.
- **before_delivery**: run package/risk validators and definition-of-done checklist.
- **after_incident**: convert confirmed control gaps into owned prevention/detection/recovery work.

Hooks should be deterministic, idempotent where possible, minimal, and must not mutate production by default.