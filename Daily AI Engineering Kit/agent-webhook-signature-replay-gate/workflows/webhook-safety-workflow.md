# Workflow: Webhook Signature and Replay Safety

## Trigger
Webhook endpoint implementation/change, duplicate-event incident, signature verification defect, provider migration.

## Entry conditions
Target endpoint/provider known; repository readable.

## Inputs
Provider signing contract, endpoint source, policy, replay store semantics, tests.

## Stages
1. **Context — Repository Explorer:** map request flow and side effects.
2. **Pre-task gate:** run package deterministic tests and verify policy schema manually/through JSON parser.
3. **Plan — Implementation Agent:** choose smallest remediation and required test matrix.
4. **Execute:** implement raw-body signature verification, freshness, and atomic replay claim.
5. **Test:** valid request plus invalid, stale, missing, malformed, tampered, duplicate, concurrent duplicate.
6. **Review:** inspect diff; confirm no unrelated contract/security changes.
7. **Verify — Verification Agent:** independently rerun critical tests and inspect ordering.
8. **Complete:** only `verified` is successful.

## Produced artifacts
Repository diff, test output, evidence JSON conforming to `schemas/evidence.schema.json`, and verifier result.

## Checkpoints
- No side effect before verification and replay claim.
- Replay claim is atomic.
- Negative tests demonstrate rejection, not merely error logging.
- Secrets absent from evidence/logs.

## Retry rules
Transient tool/environment failure: maximum 2 retries with logs preserved. Implementation/test-fix cycle: maximum 3. Deterministic signature or replay failures are not blind-retried. After limits, stop as `blocked` or `failed`.

## Approval points
Required before weakening timestamp/replay/signature policy, changing secrets, schemas, production config, public API contracts, infrastructure, or performing destructive actions.

## Failure paths
Unknown provider contract → blocked. Non-atomic replay store → blocked pending approved design change. Test failure → bounded implementation cycle. Permission failure → stop without privilege escalation.

## Definition of Done
Boundary mapped; implementation complete; negative and concurrency tests pass; relevant repository tests pass; required approvals exist; independent status is `verified`; unresolved risks are documented and non-blocking.