# Scaffolding and Templates Rules
## Purpose
Ensure generated project foundations are secure, maintainable, and aligned with supported conventions.
## Scope
Project generators, code templates, starter repositories, configuration templates, and generated defaults.
## MUST
- Templates MUST produce a valid build/test baseline on supported environments.
- Security-sensitive defaults MUST be safe by default and require explicit action to weaken.
- Generated dependencies and configuration MUST be supported and version-controlled appropriately.
- Template changes MUST be tested by generating fresh representative projects.
## MUST NOT
- MUST NOT generate credentials, insecure sample secrets, disabled validation, or permissive production defaults.
- MUST NOT silently overwrite user-owned files.
- MUST NOT encode repository-specific assumptions into generic templates without parameterization.
## SHOULD
- Generated output SHOULD be minimal and explain extension points.
- Templates SHOULD evolve compatibly or provide migration guidance.
## Exceptions
Legacy compatibility requires documented scope, risk, migration strategy, and owner.
## Verification
Generate projects in clean environments; run build, tests, security checks, diff expected output, and inspect overwrite behavior.