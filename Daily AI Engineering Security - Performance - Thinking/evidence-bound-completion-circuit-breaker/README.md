# Evidence-Bound Completion Circuit Breaker

**Category:** Thinking  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Long-running coding agents can report a task as done from component-level or stale evidence while the declared target remains unverified, then continue consuming large tool/model budgets without a bounded replan when acceptance remains unmet.

## Evidence
See `evidence/research.md`. Current signals include Codex issue #42080 (2026-09-01), Hermes issue #58196, and Hermes issue #89182, all describing unsupported completion claims or the need to gate readiness on fresh verification evidence.

## Existing approach
Frameworks already use test execution, verification prompts, passive evidence ledgers, max iterations, and timeouts. These are useful but often separate: a passing component test can be mistaken for target acceptance, while passive evidence does not necessarily block a completion claim.

## Remaining limitation
Readiness levels are conflated; evidence can be stale or from the wrong target; final-answer language is not always coupled to acceptance artifacts; generic iteration caps do not detect unchanged target evidence.

## Proposed improvement
Define an explicit acceptance contract and a monotonic readiness ledger. Completion claims are deterministic state transitions: `implemented -> validated-local -> validated-target -> released -> accepted`. A checker blocks claimed readiness unless required fresh evidence exists. A circuit breaker forces replan/stop when evidence does not advance within bounded calls/time/failures.

## Package tree
- `evidence/research.md`
- `skills/acceptance-contract-analysis.md`
- `rules/evidence-bound-completion.md`
- `subagents/verification-reviewer.md`
- `workflows/implement-verify-close.md`
- `workflows/failure-recovery.md`
- `hooks/pre-completion.md`
- `scripts/readiness_guard.py`
- `config/contract.example.json`
- `tests/test_readiness_guard.py`

## Installation
Python 3.10+, standard library only.

## Usage
`python scripts/readiness_guard.py config/contract.example.json evidence.json claimed-readiness`

Exit 0 permits the claim, exit 4 blocks unsupported/stale readiness, exit 5 trips the circuit breaker, and exit 1 indicates invalid input.

## Metrics
Unsupported completion claims, target-evidence freshness, readiness regressions, calls/time without evidence advancement, replans/task, rework after claimed completion, target acceptance rate.

## Verification
**Implemented:** contract, rules, guard, workflows, tests. **Measured:** baseline and guarded runs record readiness transitions and stalled-evidence budgets. **Verified:** unsupported claims are blocked, valid target evidence passes, and loops stop/replan within configured bounds.

## Safety
Do not invent evidence, downgrade acceptance criteria, or mark blocked work complete. Dangerous/irreversible acceptance probes require explicit human approval.

## Failure handling
Two bounded recovery cycles maximum. First refresh target state and replan; second stop with blockers/evidence and escalate. Never relax verification to force completion.

## Definition of Done
Acceptance contract exists; evidence is fresh and target-specific; requested readiness passes deterministic guard; circuit-breaker budgets are respected; independent reviewer verifies; no blocking issue remains.