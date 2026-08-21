# Output Contract Safety Rules

## MUST
- Treat consumer-observed structured output as an API contract.
- Validate candidate schemas before changing prompts, models, tool definitions, or parser code.
- Preserve baseline schema, candidate schema, gate output, and test evidence for every review.
- Require independent verification for any finding classified as breaking.
- Require explicit human approval before intentionally removing fields, adding required fields, changing field types, narrowing enums, or weakening validation/security controls.
- Use least-privilege access to production samples and redact secrets or personal data before storing evidence.
- Stop after two failed remediation attempts.

## MUST NOT
- Do not mark a task verified because the model produced valid JSON once.
- Do not accept prompt text as proof of contract compatibility.
- Do not silently update the baseline to make a failing candidate pass.
- Do not loosen schemas, make required fields optional, or ignore parser errors merely to unblock a rollout.
- Do not expose secrets, tokens, credentials, raw private prompts, or production personal data in fixtures.
- Do not deploy a breaking contract change without explicit approval and coordinated consumer migration.
- Do not retry permission, approval, or deterministic validation failures as if they were transient.

## SHOULD
- Prefer additive optional fields over breaking changes.
- Keep schemas versioned with the consuming code.
- Maintain representative fixtures for edge cases and known regressions.
- Run the gate in CI when prompt, model, schema, parser, or tool-contract files change.
- Record assumptions separately from confirmed evidence.
