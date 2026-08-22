# Output Safety Rules

## MUST
- Validate every machine-consumed agent result before handoff or side effects.
- Keep the validation schema version-controlled and review schema changes.
- Link every finding ID to at least one concrete evidence record.
- Preserve validation errors across repair attempts.
- Stop after two failed repair attempts.
- Require explicit human approval for schema changes, validation weakening, or production configuration changes.

## MUST NOT
- Treat parseable JSON as proof of semantic correctness.
- Remove required fields, loosen constraints, or set verification flags merely to obtain a passing result.
- Invent evidence, source paths, test outcomes, or confidence.
- Execute production deployment, destructive data actions, secret changes, or irreversible changes from an unverified result.
- Silently expand tool permissions.

## SHOULD
- Prefer small schemas with `additionalProperties: false` at automation boundaries.
- Separate facts/evidence from recommendations.
- Use deterministic validators before LLM review.
- Keep raw failing output when debugging recurring failures, subject to secret/privacy controls.
