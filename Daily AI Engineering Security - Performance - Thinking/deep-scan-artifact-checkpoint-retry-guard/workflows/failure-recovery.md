# Workflow: Artifact-First Failure Recovery

## Trigger
Terminal worker/phase failure, missing mandatory artifact, failed finalization, or proposed restart of an expensive scan.

## Goal
Recover the smallest correct scope while preserving validated work and preventing unapproved cost amplification.

## Inputs
Scan id, immutable target revision, manifest, artifact contract/tree, quota/cost policy, approval state.

## Baseline
Record work already dispatched/completed, artifact count, compute/token/quota consumed, and whether a usable report exists.

## Stages
1. **Observe** — freeze failed state and capture terminal evidence.
2. **Measure baseline** — quantify completed work and consumed budget.
3. **Diagnose** — run checkpoint validation per completed worker/phase.
4. **Form hypothesis** — identify smallest recovery scope.
5. **Implement improvement** — repair finalization or rerun only invalid scope.
6. **Measure again** — compare preserved-work ratio, repeated work, and budget consumed.
7. **Verify** — independent recovery verifier validates checkpoint lineage and retry authorization.

## Responsible agent
Checkpoint analyst for 1–4; coordinator maintainer for 5; `subagents/recovery-verifier.md` for 6–7.

## Tools
`checkpoint_guard.py`, read-only artifact inspection, immutable revision lookup, scan logs.

## Outputs
Validated checkpoint set, recovery decision, retry-gate evidence, before/after metrics, verification disposition.

## Checkpoints
No retry before artifact inventory. No phase completion before required artifacts validate. No full restart after terminal failure without explicit approval.

## Metrics
Preserved-work ratio; repeated worker count; wasted tokens/seconds; full rerun count; checkpoint failures; time to usable report.

## Retry policy
One automatic retry maximum for a narrower worker/phase when the cause changed. Full retry requires explicit human approval. The same deterministic failure twice stops recovery.

## Stop conditions
Verified usable finalization, policy-blocked retry, or repeated deterministic failure threshold reached.

## Failure path
Preserve all valid checkpoints, emit exact blocking reason, provide minimum next recovery action, and escalate without starting new expensive work.

## Verification
Target identity and artifact hashes match; claimed completed work is durable; retry scope is minimal; budget policy passes; verifier is independent from implementer.

## Definition of Done
Evidence preserved; artifact contract validated; minimal recovery executed if authorized; no unapproved full rerun; before/after cost captured; final output backed by valid checkpoints; independent verification passes.