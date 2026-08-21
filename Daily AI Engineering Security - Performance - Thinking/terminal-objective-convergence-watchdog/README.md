# Terminal Objective Convergence Watchdog

**Category:** Thinking

## Problem
Long-running coding agents can remain active while making little or no progress toward the actual terminal objective. They may reopen settled decisions, repeat low-information probes, expand scope, or report unsupported progress after context compaction and multi-agent delegation.

## Evidence
See `evidence/research.md`. Current 2026 Codex reports independently document >5x time overruns with zero original bugs fixed, unbounded goal loops, repeated planning without delivery, scope expansion, and post-compaction resume loops.

## Existing approach
Common controls are natural-language plans, “continue until done” prompts, generic continuation/retry loops, context summaries, and manual human interruption.

## Existing limitations
These controls often measure activity rather than evidence gain. Plans can drift after compaction, repeated probes can consume resources without changing a blocker, and status language is not necessarily tied to verified external state.

## Proposed improvement
Wrap the agent loop with a machine-readable convergence ledger. Persist the terminal objective, observable acceptance criteria, settled decisions, blockers, phase state, and action-to-uncertainty mapping. After each action, classify evidence gain. Two no-gain actions force a strategy change; three bounded low-gain cycles require checkpoint-and-stop/escalation rather than indefinite continuation.

## Architecture
- `skills/convergence-state-analysis.md` — procedure for objective/decision/evidence state.
- `rules/convergence-rules.md` — enforceable convergence invariants.
- `subagents/convergence-verifier.md` — independent reconstruction of task state.
- `workflows/observe-converge-verify.md` — bounded control loop.
- `hooks/post-action-convergence-gate.md` — deterministic post-action gate.
- `scripts/convergence_guard.py` — validates no-gain streaks and progress claims.
- `schemas/objective-ledger.schema.json` — machine-readable ledger contract.
- `evidence/research.md` — public signals, existing approaches, gaps, root causes.

## Package tree
```text
README.md
evidence/research.md
skills/convergence-state-analysis.md
rules/convergence-rules.md
subagents/convergence-verifier.md
workflows/observe-converge-verify.md
hooks/post-action-convergence-gate.md
scripts/convergence_guard.py
schemas/objective-ledger.schema.json
```

## Installation
Requires Python 3.9+. Create one objective ledger per long-running task and persist it independently of model context so compaction/resume cannot silently replace the terminal objective.

## Configuration
The ledger must include `terminal_objective`, `acceptance_criteria`, `phase`, and `actions`. Each action records `target`, `evidence_gain`, and evidence where available. Validate ledger shape using the included JSON Schema in platforms that support JSON Schema 2020-12.

## Usage
Run after each expensive action:

`python3 scripts/convergence_guard.py objective-ledger.json`

Exit 0 means no convergence gate is currently violated. Exit 2 means malformed/missing state. Exit 3 means a strategy reset, unsupported-claim correction, or checkpoint/stop is required.

## Workflow
Observe current external state → select one unresolved criterion/blocker → state the expected evidence → execute one bounded action → classify evidence gain → replan after two no-gain outcomes → stop/escalate after three low-gain cycles → independently verify terminal state.

## Metrics
Evidence-gain ratio, repeated-probe count, settled-decision reopen count, elapsed/baseline ratio, tokens per verified phase transition, unsupported progress claims, original-defect resolution rate, time to terminal verdict.

## Verification
The verifier reconstructs the phase from repository/test/build/deploy/runtime evidence rather than trusting the implementing agent's narrative. Completion requires every mandatory criterion to be evidenced and no convergence gate to be violated.

## Safety
The watchdog never weakens human approval, security gates, or required verification to improve convergence. Hitting a time/token/no-gain threshold does not authorize an irreversible action. It authorizes strategy reset, checkpoint, or escalation only.

## Failure handling
Detection: no-gain streak, low-gain three-cycle window, unsupported progress claim, or malformed ledger. Evidence: ledger/action records and external state. Retry: no more than two equivalent attempts. Fallback: change hypothesis once, then checkpoint/stop. Escalation: precise blocker plus retained evidence. Stop condition: verified completion, external blocker, authority boundary, or three low-gain cycles.

## Implemented / Measured / Verified
**Implemented** means the ledger, hook, and control integration exist. **Measured** means evidence-gain/time/token metrics were captured. **Verified** means an independent verifier reconstructs the same terminal state from external evidence.

## Definition of Done
Evidence documented; terminal objective and acceptance criteria persisted; baseline recorded; settled decisions stable; actions mapped to uncertainties; no equivalent probe repeats beyond the bound; progress claims have evidence; terminal state or precise blocker produced; metrics collected; independent verifier PASS; no blocking issue remains.

## Customization
Adapt phase names and evidence collectors to the lifecycle (code-only, release, incident response, research). Keep the core invariants: observable terminal criteria, decision finality, action-target mapping, evidence-gain measurement, bounded loops, and independent verification.