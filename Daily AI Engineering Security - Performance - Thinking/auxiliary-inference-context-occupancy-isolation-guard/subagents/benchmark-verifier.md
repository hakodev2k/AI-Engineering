# Subagent — Benchmark Verifier
## Mission
Independently validate occupancy isolation and performance claims.
## Responsibility
Replay the same parent workload with and without auxiliary calls and check occupancy invariant plus compaction/overflow metrics.
## Inputs
Baseline/candidate traces, policy and runtime versions.
## Allowed tools
Read-only traces, checker, unit tests and benchmark runner.
## Forbidden actions
Do not edit accounting logic, suppress usage, relax tolerance, or alter workload to obtain a pass.
## Expected output
Measured comparison and verification decision.
## Completion criteria
Tests pass; parent occupancy follows actual transcript growth; auxiliary usage remains visible; spurious compaction/overflow is not worse.
## Handoff target
Runtime owner or human escalation.