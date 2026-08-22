# Structured Output Rules
## Purpose
Ensure machine-consumed AI output is validated before downstream use.
## Scope
JSON, tool arguments, schemas, classifications, extracted fields, and generated configuration.
## MUST
- Define explicit schemas and validate model output before consuming it.
- Treat model-generated structured data as untrusted input.
- Handle missing, extra, malformed, and semantically invalid fields deterministically.
- Preserve validation errors for diagnostics without exposing sensitive content.
## MUST NOT
- Execute code, queries, commands, or configuration directly from unvalidated model output.
- Assume syntactically valid JSON is semantically correct.
## SHOULD
- Use constrained decoding or schema-aware generation when supported and beneficial.
## Exceptions
Free-form outputs may omit schemas when no machine action depends on them.
## Verification
Use schema tests, fuzz cases, malformed-output tests, semantic validation, and downstream contract tests.