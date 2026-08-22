# Infrastructure as Code Rules
## Purpose
Make infrastructure changes reproducible, reviewable, and recoverable.
## Scope
CloudFormation, CDK, Terraform, generated templates, and deployment parameters.
## MUST
- Define durable infrastructure through version-controlled IaC unless a documented exception exists.
- Review plans or change sets before applying material changes.
- Pin or constrain tool, provider, module, and construct versions where drift could alter behavior.
- Protect state, parameters, and generated artifacts according to sensitivity.
## MUST NOT
- Make undocumented console changes that create unmanaged production drift.
- Apply destructive infrastructure changes without impact and recovery review.
## SHOULD
- Run linting, policy checks, drift detection, and deployment previews in CI.
- Keep reusable modules cohesive with explicit inputs and outputs.
## Exceptions
Emergency manual changes require incident context, approval where feasible, and prompt reconciliation into IaC.
## Verification
Review repository definitions, plans/change sets, state controls, drift reports, CI checks, and deployment history.