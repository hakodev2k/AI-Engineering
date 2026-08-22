# Deployment Safety Rules
## Purpose
Reduce production risk when releasing model or pipeline changes.
## Scope
Model, feature, preprocessing, serving, and configuration releases.
## MUST
- Require human approval for production deployment when the role is not explicitly authorized to execute it.
- Define rollback or safe-disable behavior before high-impact releases.
- Validate artifact identity, compatibility, configuration, and acceptance gates before rollout.
- Use staged exposure when blast radius or uncertainty is material.
## MUST NOT
- Deploy an unapproved artifact or bypass failed quality gates silently.
- Make irreversible production changes without approved recovery strategy.
## SHOULD
- Separate model promotion from traffic activation.
## Exceptions
Emergency actions require incident authority, recorded rationale, and post-action review.
## Verification
Inspect approvals, deployment manifests, canary metrics, rollback tests, and artifact hashes.