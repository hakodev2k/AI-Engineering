# Workflow — Refresh and Race Verification

## Trigger
Initial discovery, reconnect, or `tools/list_changed`.

## Goal
Publish complete tool-schema generations atomically while keeping every in-flight call bound to its dispatch-time generation.

## Inputs
Current generation, new tool listing, policy, active call records.

## Baseline
Measure active generation id, current in-flight calls, refresh duration, and schema compile failures.

## Stages
1. **Observe** — collect the full refreshed listing.
2. **Measure baseline** — record current generation and active call references.
3. **Diagnose** — compare ordered tool/schema hashes with active generation.
4. **Form hypothesis** — classify valid change, malformed schema, incomplete listing, or duplicate metadata.
5. **Implement improvement** — compile a staging generation without touching active state.
6. **Measure again** — validate staging completeness and hashes.
7. **Publish** — atomically swap future-call generation.
8. **Race verification** — complete pre-refresh calls using their pinned prior validators.
9. **Independent verification** — Schema Race Verifier checks evidence.

## Responsible agent
MCP client/runtime owner implements; Schema Race Verifier verifies.

## Tools
Host MCP client plus `scripts/schema_generation_guard.py`.

## Outputs
Published generation or rollback record, call-generation ledger, metrics.

## Checkpoints
Before dispatch, before publication, after refresh, after last old-generation call completes.

## Metrics
Cross-generation validation=0; partial publications=0; compile failures visible=100%; change notifications handled=100%.

## Retry policy
Maximum 2 refresh retries; each retry must use newly obtained metadata or a corrected schema. Do not retry identical malformed input indefinitely.

## Stop conditions
Success after atomic publish/rollback and race verification. Failure after two refresh attempts or any cross-generation validation.

## Failure path
Keep staging unpublished, retain last known-good generation if policy allows, stop new calls if no valid generation exists, and escalate evidence.

## Verification
Run unchanged-refresh, valid A→B refresh, malformed-B rollback, and in-flight A/result-after-B fixtures.

## Definition of Done
Implemented, measured, and independently verified with zero cross-generation validation and zero partial publication.
