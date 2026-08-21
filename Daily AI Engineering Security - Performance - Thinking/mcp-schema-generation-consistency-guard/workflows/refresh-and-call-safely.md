# Workflow — Refresh And Call Safely

## Trigger
A tool-catalog refresh occurs while the client may have active calls.

## Goal
Publish only complete schema generations and validate each call against its dispatch-time generation.

## Inputs
Active catalog, candidate catalog, schemas, active-call registry.

## Baseline
Capture refresh failure rate, validation-skip count, overlapping refresh/call count, and current generation digest before changing behavior.

## Context
A refresh is not a mutation of individual validators; it is construction of a new complete generation.

## Stages
1. **Observe:** fetch candidate catalog without modifying active metadata.
2. **Measure:** record candidate size, schema count, compile time.
3. **Diagnose:** canonicalize schemas and detect invalid/duplicate tool definitions.
4. **Build:** compile validators into isolated generation storage.
5. **Checkpoint:** if any compile fails, preserve active generation and stop publication.
6. **Publish:** atomically mark the candidate active.
7. **Dispatch:** calls capture the current generation before network/tool execution.
8. **Validate:** response uses the captured validator, not the latest active registry.
9. **Verify:** run race and rollback tests and inspect zero skipped-validation paths.

## Responsible agent
Implementation Agent builds integration; Schema Generation Verifier independently checks evidence.

## Tools
JSON/schema validator, `scripts/schema_generation_guard.py`, unit tests, host telemetry.

## Outputs
Generation manifest, validation records, before/after metrics, verifier verdict.

## Checkpoints
- candidate compile complete;
- active generation unchanged on failure;
- generation pinned at call dispatch;
- validation outcome recorded.

## Metrics
Skipped validation = 0; partial publication = 0; wrong-generation validation = 0; refresh/compile latency measured.

## Retry policy
One retry only for transient catalog transport failure. Invalid schema input requires changed input, not retry.

## Stop conditions
Stop on compile failure, inconsistent generation metadata, missing pinned validator, or verifier rejection.

## Failure path
Retain last known-good generation, block unsafe refresh publication, surface actionable schema/tool identity, escalate repeated publisher errors.

## Verification
Race a delayed tool call against a catalog change and prove it validates against the old generation while subsequent calls use the new one.

## Definition of Done
All generation tests pass, no validation bypass exists, rollback evidence is recorded, and independent verification is complete.
