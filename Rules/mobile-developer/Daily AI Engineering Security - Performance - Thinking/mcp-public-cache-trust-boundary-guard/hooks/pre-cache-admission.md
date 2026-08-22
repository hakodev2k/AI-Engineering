# Hook: Pre-cache Admission

## Trigger
Before writing a cacheable MCP result or serving a cached result across authorization contexts.

## Preconditions
Server identity, negotiated protocol, method, scope, and current trust policy are known.

## Action
Run `scripts/cache_key_guard.py` with redacted identity inputs. For public responses, pass `--trusted-server` only when the configured trust policy explicitly recognizes the authenticated server identity.

## Expected result
Exit 0 with `ALLOW_PRIVATE` or `ALLOW_SHARED`. Shared reuse additionally requires unchanged current policy and schema.

## Failure behavior
Exit 2 blocks due to invalid input. Exit 3 means `NO_STORE`: fetch/use the response without shared caching. Identity/schema mismatch purges the scoped entry and blocks the hit.

## Blocking
Yes for the shared-cache operation; no requirement to block the entire task when a safe fresh/private path exists.