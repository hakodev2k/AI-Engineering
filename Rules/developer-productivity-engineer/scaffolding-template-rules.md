# Scaffolding and Template Rules
## Purpose
Ensure generated projects start from secure, maintainable defaults.
## Scope
Project generators, repository templates, code scaffolds, and golden paths.
## MUST
- Templates MUST produce buildable, testable output using supported tool versions.
- Security, observability, ownership, and dependency defaults MUST match current platform standards where applicable.
- Template changes MUST be validated against both new projects and supported upgrade paths.
- Generated placeholders MUST be explicit and safe if left unchanged.
## MUST NOT
- MUST NOT generate credentials, insecure sample configuration, or production endpoints.
- MUST NOT silently overwrite user-owned code during regeneration.
## SHOULD
- Generated structure SHOULD be minimal and extensible rather than speculative.
## Exceptions
Specialized templates may diverge when constraints and ownership are documented.
## Verification
Generate from clean state, build/test output, scan for secrets, inspect diffs, and exercise regeneration.