# Workflow: Resume Preflight and Recovery

## Trigger
A human, service, or agent submits input intended to resume a paused stateful graph.

## Goal
Ensure the response is explicitly and correctly associated with current durable interrupt identity before graph execution continues.

## Inputs
Authoritative pending interrupt snapshot, thread/checkpoint identity, resume envelope, policy, and intended resolution mode.

## Baseline
Before integration, record how the application behaves for: one scalar interrupt, one object-valued scalar response, two parallel interrupts, nested parallel interrupts, unknown/stale IDs, and partial maps.

## Context
Use `evidence/research.md` and current framework docs. Never assume framework internals count nested interrupts correctly.

## Stages
1. **Observe** — read current pending interrupts and checkpoint identity.
2. **Measure baseline** — capture pending count/IDs and current adapter behavior.
3. **Diagnose** — identify whether ambiguity comes from payload overloading, lost IDs, stale state, or incomplete pending enumeration.
4. **Form hypothesis** — choose explicit envelope/addressing behavior.
5. **Implement** — integrate the guard before `Command(resume=...)`.
6. **Measure again** — run scalar-object and multi/nested interrupt cases.
7. **Improved?** — if no, refresh authoritative state and perform at most one corrective cycle.
8. **Verify** — independent agent compares expected addressed IDs to actual resolved IDs.

## Responsible agent
Application implementer owns stages 1–7. `subagents/verification-agent.md` owns stage 8.

## Tools
Checkpoint/graph state APIs, UI/API adapter logs, `scripts/resume_guard.py`, unit tests, controlled LangGraph integration tests.

## Outputs
Pre/post pending snapshots, guard decision, normalized payload, resolved-ID evidence, and status.

## Checkpoints
- C1 authoritative pending set captured.
- C2 resume envelope classified explicitly.
- C3 preflight allowed with addressed IDs recorded.
- C4 post-resume pending set captured.
- C5 independent verification complete.

## Metrics
Ambiguous attempts blocked, stale IDs blocked, explicit multi-interrupt mapping rate, resolved-ID coverage, unintended residual interrupts, and regression pass rate.

## Retry policy
Maximum one retry after refreshing the authoritative pending set. The retry must use a newly validated envelope or updated state; never replay an ambiguous value blindly.

## Stop conditions
Verified association; persistent ambiguity after one refresh; unknown/duplicate IDs; or inability to retrieve authoritative pending state.

## Failure path
Do not invoke the graph. Preserve the pending state, return a machine-readable block reason, refresh the UI/request if possible, and escalate when a new user response is required.

## Verification
The independent verifier confirms addressed IDs and actually resolved IDs match, and unintended pending branches were not consumed.

## Definition of Done
Evidence documented; baseline captured; adapter uses discriminated envelopes; guard blocks ambiguous/stale cases; tests pass; before/after pending sets are compared; risks documented; independent verification complete; no blocking ambiguity remains.
