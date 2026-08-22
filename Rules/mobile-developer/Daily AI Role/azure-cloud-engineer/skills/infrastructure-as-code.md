# Skill: Infrastructure as Code

**Purpose:** produce deterministic Azure infrastructure changes.
**Inputs:** desired state, current IaC, environment variables, dependencies, state backend, approvals.
**Steps:** inspect existing conventions → isolate change scope → parameterize environment differences → reference secrets through secure providers → run format/static validation → produce plan/what-if → review destructive/replacement actions → obtain approval gates → apply staged change → verify actual resources → record drift or residual manual steps.
**Tools:** Bicep, Terraform, ARM or other approved IaC; keep tool-neutral decision logic.
**Quality:** idempotent where possible, no hardcoded secrets, predictable naming, explicit dependencies, safe defaults.
**Retry:** max two transient retries after cause classification.
