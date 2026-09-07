# Configuration and Secrets Rules

## Purpose
Keep runtime configuration explicit, validated, secure, and safely changeable.

## Scope
Applies to application properties, environment variables, feature configuration, credentials, and runtime settings.

## MUST
- Required configuration MUST be validated at startup or before first use with clear failure behavior.
- Environment-specific values MUST remain outside compiled application logic.
- Secrets MUST use approved secret storage and access mechanisms.
- Production configuration changes MUST be reviewed, auditable, and have rollback or restoration instructions.
- Dynamic configuration MUST define consistency, refresh, and failure semantics.

## MUST NOT
- MUST NOT commit real credentials, tokens, private keys, or production secrets.
- MUST NOT log secret values during binding, startup, or diagnostics.
- MUST NOT use insecure fallback defaults for authentication, encryption, authorization, or external endpoints.

## SHOULD
- Prefer typed configuration with documented units, ranges, and defaults.
- Keep configuration surface minimal and remove obsolete switches.

## Exceptions
Emergency production configuration changes require explicit human authority, bounded scope, recorded rationale, and post-change validation.

## Verification
Use secret scanning, configuration-schema tests, startup tests, environment diff review, audit history, access review, and rollback rehearsal for critical settings.