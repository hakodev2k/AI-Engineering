# Cache Key Design

## Purpose
Convert verified response and authorization boundaries into a deterministic, privacy-preserving cache key and bounded cache policy.

## When to use
After cache-boundary-analysis identifies the required isolation fields.

## Inputs
Boundary inventory, current cache implementation, model configuration, tool schema, response format, tenant/data-scope identifiers, TTL requirements.

## Preconditions
All mandatory isolation fields have known stable sources.

## Procedure
1. Use namespace/version plus hashes rather than embedding raw prompts or secrets in keys.
2. Include model identity and every model parameter known to alter response semantics.
3. Hash system prompt, user prompt, tool schema, and structured response format using canonical JSON.
4. Include tenant and data-scope identifiers whenever outputs can depend on tenant-restricted data.
5. Include user identity only when authorization or personalization differs by user; otherwise document why tenant-level reuse is safe.
6. Version the namespace when key semantics change.
7. Cap TTL using `config/cache-policy.yaml` and choose a shorter TTL where permissions or source data change frequently.
8. Validate proposed requests with `python scripts/cache_key_gate.py --request <file> --policy config/cache-policy.yaml`.
9. Add regression tests proving that material changes produce different keys and equivalent requests produce the same key.
10. Inspect the final key material for secrets and raw personal data.

## Expected output
A key specification, policy update if required, test evidence, and a PASS/BLOCK gate result.

## Verification
Tests must prove separation across tenant/data scopes and sensitivity to prompts, model configuration, tool schemas, and response formats required by policy.

## Failure handling
If stable isolation metadata is unavailable, do not fall back to a global key. Disable caching for that request path and escalate.

## Stop conditions
Stop before production cache migration, purge, or key rollout without explicit approval and rollback plan.
