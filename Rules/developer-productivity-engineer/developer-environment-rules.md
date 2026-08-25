# Developer Environment Rules
## Purpose
Keep local development reproducible, fast, and diagnosable.
## Scope
Workstations, dev containers, bootstrap scripts, local services, and toolchains.
## MUST
- Environment setup MUST be automated or documented as executable steps with pinned prerequisites.
- Bootstrap failures MUST expose actionable diagnostics and non-zero exit status.
- Supported tool versions MUST be explicit and validated before expensive setup work.
- Environment changes affecting teams MUST include migration and rollback guidance.
## MUST NOT
- MUST NOT require undocumented machine-local state, personal credentials, or manual database mutation.
- MUST NOT silently install privileged software or weaken host security controls.
## SHOULD
- Setup SHOULD be idempotent and converge from a clean machine.
- Local defaults SHOULD resemble production contracts without copying production secrets or data.
## Exceptions
Exceptions require rationale, affected population, risk, temporary workaround, owner, and removal date.
## Verification
Run bootstrap on a clean environment; inspect version checks, exit codes, secret handling, and documented recovery.