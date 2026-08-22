# Workflow: Enforce Lineage Guardrails

## Trigger
Any multi-agent task that spawns a subagent, teammate, or nested delegate.

## Goal
Ensure security policy remains enforced and attributable across the entire agent lineage.

## Inputs
Root policy, child launch request, audit sink, protected-tool definitions.

## Baseline
Record expected descendants, current policy hash, protected-tool coverage, and unattributed-event count.

## Stages
1. Observe current enforcement surface.
2. Measure baseline hook coverage with non-destructive probes.
3. Diagnose missing identity/propagation paths.
4. Form a concrete propagation hypothesis.
5. Bind lineage metadata and immutable policy hash at launch.
6. Probe again after child startup.
7. Execute work only after PASS.
8. Independently verify audit coverage before completion.

## Responsible agents
Host/orchestrator implements; Lineage Security Verifier independently checks.

## Tools
Hashing, audit parser, safe hook probes, child inventory.

## Outputs
Lineage ledger, before/after coverage metrics, verification decision.

## Checkpoints
Before child work; before first high-risk call; before task completion.

## Metrics
Hook coverage %, unattributed protected calls, policy mismatches, blocked violations, verification latency.

## Retry policy
One relaunch/remediation attempt per failed child propagation.

## Stop conditions
Two propagation failures, any unresolved high-risk unattributed call, policy tampering, or missing independent verification.

## Failure path
Suspend the affected child, preserve evidence, fall back to the parent/direct execution under known policy, or require human approval if the task cannot proceed safely.

## Verification
Verifier recomputes policy hashes and proves 100% protected-call attribution for expected descendants.

## Definition of Done
Baseline and post-change metrics exist; every descendant is identified; required policy hashes match; protected calls are fully audited; tests/probes pass; no blocking security issue remains.