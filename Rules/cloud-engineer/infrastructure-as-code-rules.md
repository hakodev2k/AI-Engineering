# Infrastructure as Code Rules
## Purpose
Make infrastructure changes reviewable, repeatable, and recoverable.
## Scope
Provisioning templates, modules, state, policy, and infrastructure delivery pipelines.
## MUST
- Production infrastructure MUST be represented as code where the platform supports reliable automation.
- Infrastructure changes MUST be reviewed through version-controlled diffs and validated before apply.
- State and locking mechanisms MUST be protected against corruption and unauthorized access.
## MUST NOT
- MUST NOT make undocumented console-only production changes except during approved emergency response.
- MUST NOT bypass validation or policy checks to accelerate routine delivery.
## SHOULD
- Reconcile emergency manual changes back into code promptly.
## Exceptions
Exceptions require reason, affected resources, recovery steps, reconciliation plan, and approval.
## Verification
Inspect repository history, plans/diffs, pipeline evidence, drift reports, state controls, and deployed configuration.