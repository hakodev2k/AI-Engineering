# Repository and Git Rules
## Purpose
Protect mobile source, generated artifacts, signing material, and release history.
## Scope
Git workflow, binary assets, generated files, large files, branches, and history operations.
## MUST
- Source changes MUST be reviewable and traceable to the resulting mobile build.
- Generated artifacts MUST have a clear policy for source-of-truth and reproducibility.
- Large binary assets MUST use an appropriate storage/versioning strategy.
## MUST NOT
- Signing keys, provisioning secrets, tokens, or sensitive configuration MUST NOT be committed.
- Force push or history rewriting on shared protected history MUST NOT occur without explicit human approval.
## SHOULD
- Commits SHOULD separate mechanical/generated changes from behavioral changes when it improves reviewability.
## Exceptions
Generated lock or project files required by the build may be committed when reproducibility depends on them.
## Verification
Use secret scanning, branch protection, artifact provenance, diff review, and repository-size monitoring.