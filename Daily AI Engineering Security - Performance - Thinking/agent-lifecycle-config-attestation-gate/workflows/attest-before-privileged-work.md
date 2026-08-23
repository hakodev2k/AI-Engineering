# Workflow: Attest Before Privileged Work

## Trigger
An agent crosses spawn/resume/fork/nested-root/profile/MCP-refresh boundary and is about to receive privileged capability.

## Goal
Prove effective runtime configuration before the capability is exercised.

## Inputs
Declared contract, protected paths, lifecycle metadata, runtime snapshot.

## Baseline
Measure current transition coverage and collect one safe canary per supported lifecycle path.

## Stages
1. **Observe** — identify actor, root, lifecycle transition, intended capability.
2. **Measure baseline** — capture expected and observed snapshots before any privileged action.
3. **Diagnose** — compare protected fields and snapshot provenance.
4. **Form hypothesis** — if mismatched, classify merge/inheritance/ignored-key/stale-snapshot/root-selection cause.
5. **Implement improvement** — correct host configuration or lifecycle integration; never weaken expected policy.
6. **Measure again** — capture a fresh runtime snapshot and rerun attestation.
7. **Verify** — independent verifier reviews evidence.

## Responsible agent
Orchestrator gathers evidence; Config Security Verifier performs independent verification.

## Tools
Runtime introspection, `scripts/attest_config.py`, audit sink, unit tests.

## Outputs
Attestation report, hashes, decision, mismatch cause, verification status.

## Checkpoints
Before privileged capability assignment; after any retry; before completion.

## Metrics
Coverage, mismatch count, mismatch cause distribution, gate latency, blocked privileged actions.

## Retry policy
Maximum one refresh/re-attestation for suspected stale snapshot. Configuration remediation is a new bounded attempt, maximum two remediation cycles.

## Stop conditions
Unknown snapshot provenance, persistent protected mismatch, or inability to bind actor/root/lifecycle identity.

## Failure path
Fallback to a known-good parent/session under proven policy or escalate to human security review.

## Verification
Tests plus transition-specific canary and independent review.

## Definition of Done
Attestation passes, evidence provenance is verified, privileged action has not occurred before the pass, metrics recorded, no blocking mismatch remains.