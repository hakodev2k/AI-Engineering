# Output Contract Governance

## MUST
- Bind every machine-consumed agent output to a named contract and explicit version.
- Validate structured output before handing it to a downstream consumer.
- Preserve the exact baseline and candidate schema hashes used for compatibility decisions.
- Treat removed fields, newly required fields, incompatible type changes, narrowed enums, stricter nullability, and restrictive additional-properties changes as compatibility-sensitive.
- Record semantic changes separately from structural schema changes.
- Run configured consumer replay checks for high-risk contracts.
- Require independent review for breaking or migration-required changes.
- Require explicit human approval before releasing a breaking contract to existing consumers.
- Preserve first-failure evidence and bounded retry history.
- Fail closed when a required schema, consumer inventory, replay result, or approval is missing.

## MUST NOT
- Do not silently overwrite the approved baseline with a candidate schema to make a diff disappear.
- Do not infer compatibility only because JSON parsing succeeds.
- Do not rename enum values, change units, timestamps, confidence semantics, status meanings, identifiers, or ordering guarantees without treating the semantic change as contract-relevant.
- Do not let the producer/implementer be the sole reviewer of a breaking change.
- Do not place secrets, tokens, credentials, or raw sensitive production payloads in schema examples or evidence artifacts.
- Do not retry validation failures until they happen to pass.
- Do not weaken consumer validation solely to accommodate an unapproved producer drift.
- Do not claim `verified` when only generation or schema comparison executed.

## SHOULD
- Prefer additive optional fields for backward-compatible evolution.
- Prefer explicit deprecation windows before removing fields or enum values.
- Keep contract schemas close to producer/consumer code and version them in source control.
- Use fixtures that cover required fields, optional fields, edge enums, nullability, and error states.
- Keep unknown-field behavior explicit per contract.
- Introduce a new major contract version when compatibility cannot be preserved cleanly.

## Approval boundaries
Human approval is required before production rollout of breaking structured-output changes, weakening validation/security constraints, deleting historical contract versions still used by consumers, or changing externally visible semantics with irreversible effects.