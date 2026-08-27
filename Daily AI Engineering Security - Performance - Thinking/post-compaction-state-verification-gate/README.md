# Post-Compaction State Verification Gate

**Category:** Thinking

## Problem
Long-horizon agents can treat compressed summaries as ground truth. Recent evidence shows compaction can weaken recent-interaction influence, increase repeated exploration, and correlate with stale-state trust and looping.

## Evidence
See `evidence/research.md`.

## Existing approach
Automatic/manual compaction, larger context windows, user restart/handoff, and generic summarization.

## Existing limitations
A summary can preserve a plausible narrative while dropping constraints or misstating external state. Agents may then act on unverified “done” claims.

## Proposed improvement
After every compaction boundary, require an observable state-verification contract: extract claims, classify which require external re-check, verify against files/tests/task state, and prohibit consequential actions until critical claims are grounded.

## Architecture
- `scripts/checkpoint_verify.py` — deterministic claim gate
- `tests/test_checkpoint_verify.py` — regression tests
- `skills/post-compaction-grounding.md` — reusable re-grounding procedure
- `rules/compaction-boundary.md` — enforceable controls
- `subagents/checkpoint-verifier.md` — independent verifier
- `workflows/compact-reground-continue.md` — bounded execution path
- `hooks/post-compaction.md` — blocking hook
- `evidence/research.md` — public evidence

## Installation
Python 3.10+. No third-party dependencies.

## Usage
`python scripts/checkpoint_verify.py checkpoint.json`

Checkpoint claims contain `id`, `text`, `critical`, `status`, and evidence references; loop state contains `attempt` and `max_attempts`.

## Metrics
Unsupported critical claims, verification coverage, repeated-action count, failed-loop count, rework rate, task success after compaction.

## Verification
Run `python -m unittest tests/test_checkpoint_verify.py`.

## Safety
The package does not request hidden chain-of-thought. It operates on explicit facts, claims, evidence, decisions, risks, and verification status.

## Failure handling
Maximum 2 verification-repair cycles. If critical claims cannot be grounded, stop and escalate rather than continue autonomously.

## Definition of Done
**Implemented:** post-compaction gate integrated. **Measured:** coverage and repeated-action metrics collected. **Verified:** critical claims are grounded, loop bounds enforced, tests pass, and an independent verifier signs off.
