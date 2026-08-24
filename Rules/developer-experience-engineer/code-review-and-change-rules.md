# Code Review and Change Rules
## Purpose
Ensure developer-experience changes receive risk-proportionate review and evidence.
## Scope
Source, configuration, scripts, templates, workflows, dependencies, and platform changes.
## MUST
- Changes MUST state intended behavior, affected workflows, verification performed, and material risks.
- Security-, compatibility-, production-, or organization-wide changes MUST receive qualified human review before execution or rollout.
- Reviewers MUST evaluate failure modes and rollback for high-impact changes.
- Generated or bulk diffs MUST remain reviewable through provenance or focused evidence.
## MUST NOT
- MUST NOT merge known failing mandatory checks without an authorized documented exception.
- MUST NOT hide behavioral changes inside formatting or unrelated refactors.
- MUST NOT treat agent confidence or code generation as verification.
## SHOULD
- Changes SHOULD be scoped so reviewers can reason about behavior and blast radius.
- Risky migrations SHOULD separate preparatory, rollout, and cleanup phases.
## Exceptions
Emergency changes require authorized approval, bounded scope, explicit verification, and retrospective review.
## Verification
Inspect pull-request evidence, CI status, reviewer qualifications, diff scope, test results, approvals, and rollback plans.