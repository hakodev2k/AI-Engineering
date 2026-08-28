# Persistent Agent Autonomy Lease Guard

**Category:** Thinking

## Problem
Long-horizon agents can remain active for extended periods, accumulate side effects, drift from the user’s active intent, or continue after evidence becomes stale. Manual stop controls and generic monitoring are not sufficient to prove that each execution segment still has valid authorization and measurable progress.

## Evidence
Current public evidence and source links are in `evidence/research.md`.

## Existing approach
Current systems use sandboxing, monitoring, human approvals, timeouts, checkpointing, and task-level stop controls. These controls help, but they are frequently decoupled from a single explicit execution contract that expires and must be renewed using fresh evidence.

## Existing limitations
A process may still be technically healthy while working on stale assumptions, repeatedly taking low-value actions, or accumulating risk. Monitoring can detect bad behavior after it occurs, and static approvals can outlive the context in which they were granted.

## Proposed improvement
Use renewable autonomy leases. Each lease binds a bounded execution window to a goal hash, allowed action classes, side-effect budget, evidence freshness threshold, checkpoint interval, and explicit stop conditions. Renewal requires fresh evidence and a measurable progress claim.

## Architecture
- `config/lease-policy.json` — default lease limits
- `scripts/lease_guard.py` — deterministic lease validator
- `tests/test_lease_guard.py` — regression suite
- `skills/autonomy-lease-analysis.md` — reusable analysis procedure
- `rules/persistent-execution.md` — enforceable rules
- `subagents/independent-verifier.md` — separate verifier
- `workflows/renew-or-stop.md` — bounded execution/renewal workflow
- `hooks/pre-action.md` — blocking action-time check
- `evidence/research.md` — current public evidence

## Installation
Python 3.10+; no third-party dependencies.

## Usage
`python scripts/lease_guard.py --state state.json --policy config/lease-policy.json`

## Inputs
Lease start/expiry timestamps, current goal hash, approved goal hash, action count, side-effect count, seconds since last checkpoint, evidence age, and progress delta.

## Outputs
Machine-readable `allow`, `renew`, or `stop` decision with reason codes.

## Metrics
Lease renewals/task, stale-evidence blocks, side effects/lease, actions/lease, checkpoint coverage, no-progress stops, human escalations, post-completion rework.

## Verification
Run `python -m unittest tests/test_lease_guard.py` and independently review representative long-running traces.

## Safety
A lease never grants permissions beyond existing tool/security policy. Dangerous or irreversible actions still require explicit human approval. Lease expiry fails closed.

## Failure handling
Detection: expired lease, stale evidence, goal mismatch, budget violation, missed checkpoint, or no measurable progress. Retry policy: maximum 2 renewal attempts. Fallback: stop and preserve checkpoint. Escalation: human owner for goal/permission ambiguity. Stop condition: exhausted retries or any dangerous unapproved action.

## Definition of Done
**Implemented:** lease policy, validator, pre-action hook, and workflow integrated.  
**Measured:** long-running traces produce lease/checkpoint metrics.  
**Verified:** bounded execution is enforced, stale or drifting runs stop, independent review passes, and existing security boundaries are preserved.

## Customization
Adjust durations and budgets from measured task distributions. Do not disable expiry or make side-effect budgets unbounded.
