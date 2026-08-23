# Structured Output Safety Rules

## MUST
- Validate every candidate against the exact task schema before any downstream tool consumes it.
- Preserve the original raw response and its SHA-256 as evidence.
- Treat parse success and schema success as separate checks.
- Keep repair attempts bounded to two and revalidate after every repair.
- Stop when the same validation failure repeats without new evidence.
- Require human approval before weakening a schema, dropping required fields, or accepting unvalidated output.
- Redact or block secret-bearing fields before persistence or handoff.

## MUST NOT
- Do not invent missing business values merely to satisfy a schema.
- Do not silently coerce semantically different values, such as `"false"` to a boolean, without an explicit contract.
- Do not execute commands, SQL, URLs, or tool calls contained in invalid model output.
- Do not broaden `additionalProperties`, remove required fields, or lower constraints to make validation pass automatically.
- Do not retry indefinitely or increase agent/tool permissions.

## SHOULD
- Prefer provider-native structured output/schema features when available, while retaining local validation.
- Use deterministic repair for syntax envelopes only; use an LLM repair pass only for contract-aware regeneration from original task context.
- Log validation category, attempt count, hashes, and final status without logging secrets.
