# Semantic Cache Safety Rules

## MUST
- Evaluate eligibility before similarity lookup and fail closed when required context is missing.
- Partition candidates by tenant, authorization scope, model, system-prompt hash, toolset hash, schema version, and locale when enabled in policy.
- Bypass cache for detected secrets, personal data, mutation intent, or requests expected to invoke tools.
- Enforce entry age and similarity thresholds deterministically.
- Preserve evidence for hit, miss, and bypass decisions without logging raw sensitive prompts.
- Re-run tests and package verification after policy or gate changes.
- Require explicit human approval before weakening isolation dimensions, lowering the similarity threshold below an established production baseline, or enabling caching for state-changing/tool-executing requests.

## MUST NOT
- Share semantic cache entries across tenants or authorization scopes merely because prompts are similar.
- Cache authentication material, secrets, raw cookies, personal identifiers, payment data, or production credentials.
- Treat embedding similarity alone as proof that two requests are semantically interchangeable.
- Reuse an answer produced under a different system prompt, toolset, output schema, or model when exact matching is required.
- Cache or replay tool calls, mutations, deployments, purchases, approvals, deletions, or other side effects.
- Increase permissions or expose hidden context to improve hit rate.

## SHOULD
- Prefer narrow allowlisted read-only purposes.
- Keep TTL short until production evidence demonstrates safe staleness tolerance.
- Record cache decision reason, entry identifier, similarity score, and non-sensitive context hashes.
- Version policy and invalidate entries when behavior-affecting configuration changes.
