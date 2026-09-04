# Skill: Session Prefix Integrity Audit

## Purpose
Verify that a persisted/resumed agent session reconstructs the same cache-sensitive model prefix as the known-good request when runtime identity has not intentionally changed.

## Trigger
Before the first model call after session resume, process restart, UI/CLI/gateway handoff, or durable conversation restore.

## Inputs
- baseline prefix manifest captured from the exact model-visible request
- reconstructed resume prefix manifest
- runtime identity: provider, model, toolset/schema version, prompt renderer version
- `config/policy.json`
- optional provider usage metrics from baseline/resume calls

## Preconditions
The baseline must come from a successful request and be persisted atomically with its runtime identity. Prefix content may remain in the host's protected store; this package only requires exact input manifests at check time and emits hashes/lengths rather than contents.

## Required context
Cache-sensitive prefix segments and runtime identity only. Required task context MUST NOT be removed merely to improve cache reuse.

## Allowed tools
Read-only session/prompt inspection, provider usage telemetry, `scripts/prefix_persistence_guard.py`, tests, and benchmark logging.

## Constraints
Do not mutate historical prompt bytes just to make hashes match. Do not reuse a baseline across a changed provider/model/toolset/rendering contract unless the platform proves compatibility. Do not expose prompt contents in logs.

## Procedure
1. Capture baseline exact prefix segments from the provider request boundary.
2. Persist a manifest containing segment names/order, byte lengths, SHA-256 hashes, and runtime identity.
3. On resume, reconstruct the exact request prefix through the production path.
4. Capture the resumed manifest before the model call.
5. Compare runtime identity; if changed, require explicit rebaseline.
6. Compare segment count/order, total bytes, and full prefix hash.
7. If mismatched, locate the first differing segment/byte without logging contents.
8. Diagnose missing persistence, write-order defects, replay serialization drift, or intentional runtime change.
9. Repair the persistence/reconstruction path.
10. Measure the resumed call again and compare cache creation/read tokens, input tokens, and TTFT.

## Decision points
- Same runtime identity + exact hash match: allow.
- Same runtime identity + missing/changed prefix: block or fail the cache-integrity gate according to policy; do not silently spend a large re-prefill.
- Changed runtime identity: `rebaseline_required`; preserve correctness and establish a new known-good baseline.
- Exact prefix match but cache miss persists: investigate provider/backend cache semantics rather than modifying context blindly.

## Expected output
Verdict, baseline/resume hashes and lengths, first differing segment/byte if any, runtime-identity comparison, and measured cache-performance delta when telemetry is available.

## Metrics
Prefix match rate, cache creation/input tokens, cache hit/read ratio, resume TTFT, tokens/task, cost/task, and quality/regression rate.

## Verification
Use byte-identical, missing-segment, reordered-segment, modified-byte, empty/null prefix, and runtime-identity-change fixtures. Then validate against real provider/backend telemetry.

## Failure handling
Input read failures may retry twice. A deterministic mismatch is not retried without a changed reconstruction/persistence state. Provider measurement may retry once for a clearly transient transport failure.

## Stop conditions
Stop on verified exact match plus acceptable measured behavior, explicit rebaseline after legitimate runtime change, or an unresolved mismatch after three repair attempts.
