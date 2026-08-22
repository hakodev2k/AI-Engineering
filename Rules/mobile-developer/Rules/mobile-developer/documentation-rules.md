# Documentation Rules
## Purpose
Preserve operational and architectural knowledge that cannot be safely inferred from code alone.
## Scope
Architecture decisions, platform setup, release/signing, environment configuration, migrations, and incident runbooks.
## MUST
- Non-obvious platform constraints and irreversible decisions MUST be documented near the authoritative workflow or decision record.
- Release/signing and recovery procedures MUST be executable without relying on one person's memory.
- Documentation that grants operational access MUST avoid embedding secrets.
## MUST NOT
- Documentation MUST NOT claim support, security, or performance guarantees that lack current evidence.
- Deprecated setup instructions MUST NOT remain indistinguishable from current procedures.
## SHOULD
- Documentation SHOULD state owner, prerequisites, verification, and last-known-valid context for high-risk procedures.
## Exceptions
Self-evident local implementation details need not be separately documented.
## Verification
Periodically execute runbooks, compare docs with CI/configuration, inspect links/owners, and review after incidents or platform changes.