# Model Release Rules
## Purpose
Control production risk when analytical artifacts affect live decisions.
## Scope
Model promotion, rollout, rollback, and material scoring changes.
## MUST
- Require documented acceptance evidence, artifact identity, dependencies, monitoring, rollback path, and accountable owner before release.
- Obtain human approval for production deployment or material decision-policy changes.
- Use staged rollout or equivalent containment for high-impact changes where feasible.
## MUST NOT
- Deploy directly from an exploratory notebook or unversioned artifact.
- Replace a production model without preserving a tested recovery path.
## SHOULD
- Separate model approval from implementation mechanics for high-risk systems.
## Exceptions
Emergency changes require explicit approval and retrospective validation.
## Verification
Inspect release records, artifact hashes, approvals, deployment configuration, monitoring, and rollback tests.