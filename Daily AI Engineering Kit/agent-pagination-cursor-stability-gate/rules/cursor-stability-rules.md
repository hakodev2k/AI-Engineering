# Cursor Stability Rules

## MUST
- Use a deterministic total order; the final ordering tuple must uniquely identify a row.
- Encode enough ordering state in the cursor to reproduce the boundary comparison.
- Keep cursor predicates consistent with sort direction and null handling.
- Block on duplicate IDs, missing expected IDs, cursor cycles/discontinuities, or non-monotonic order.
- Preserve tenant and security filters.
- Add a regression test for every confirmed defect.
- Independently verify the final trace.
- Require approval before breaking a public cursor/API contract.
- Preserve failure evidence and bounded retry history.

## MUST NOT
- Silently replace cursor pagination with offset pagination.
- Use a non-unique timestamp alone as the terminal ordering key.
- Drop ordering fields during cursor encoding.
- Retry deterministic failures until they disappear.
- Modify production data to make tests pass.
- Weaken authorization, tenant filters, or security controls.
- Force-push, rewrite history, deploy, or run destructive SQL.

## SHOULD
- Prefer keyset predicates that mirror the full ORDER BY tuple.
- Prefer stable ordering fields.
- Keep cursor tokens opaque while versioning internal payloads explicitly.
- Support old/new cursor versions during migration when compatibility is required.
- Capture endpoint-level traces in integration tests.
