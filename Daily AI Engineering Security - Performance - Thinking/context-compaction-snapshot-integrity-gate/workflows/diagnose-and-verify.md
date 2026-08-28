# Workflow: Diagnose and Verify Context Snapshot Integrity
## Trigger
Premature/repeated compaction, impossible context percentages, or token metadata inconsistent with actual transcript/model-call evidence.
## Goal
Restore trustworthy context accounting before automatic compaction is allowed.
## Inputs
Session snapshot, policy, writer/runtime path, provider semantics, regression workload.
## Baseline
Capture persisted total, latest-call context, cumulative run usage, optional transcript estimate, compactions/session and summarization usage.
## Stages
1. Observe the failing runtime path.
2. Measure all token quantities separately.
3. Diagnose the semantic mismatch and name the provenance of each value.
4. Form a falsifiable hypothesis about the writer/fallback that corrupts the snapshot.
5. Implement the smallest change that preserves typed snapshot provenance.
6. Measure again with a multi-tool-loop fixture.
7. If not improved, revise once; otherwise continue.
8. Independent Token Snapshot Verifier checks false-positive and true-positive compaction cases.
## Responsible agent
Implementer owns stages 1–7; verifier owns stage 8.
## Tools
Snapshot guard, unit tests, read-only session/transcript telemetry.
## Outputs
Before/after drift metrics, root cause, implementation record, verification result.
## Checkpoints
Before any destructive compaction test; after recomputation; before release.
## Metrics
Persisted/latest ratio, transcript drift, false compaction rate, compactions/session, summary tokens, quality regression.
## Retry policy
Maximum one recomputation/revision after the initial diagnosis.
## Stop conditions
Stop if snapshot provenance remains unknown, provider semantics conflict, or destructive history loss is observed.
## Failure path
Disable automatic compaction for the affected path and preserve the session for manual recovery.
## Verification
Known cumulative-usage fixture must be blocked; genuine above-threshold context fixture must pass.
## Definition of Done
Token semantics are typed, drift is within policy, bounded compaction decisions are reproducible, and no unresolved data-loss risk remains.
