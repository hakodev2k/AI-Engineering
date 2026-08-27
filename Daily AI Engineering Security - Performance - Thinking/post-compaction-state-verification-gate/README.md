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
A post-compaction hook requires a structured checkpoint; the deterministic verifier blocks ungrounded critical claims and exhausted retry budgets; rules/workflow preserve observable stop conditions; a separate verifier agent reviews high-impact completion claims.

## Actual package tree
```text
post-compaction-state-verification-gate/
├── README.md
├── evidence/research.md
├── hooks/post-compaction.md
├── rules/compaction-boundary.md
├── scripts/checkpoint_verify.py
├── skills/post-compaction-grounding.md
├── subagents/checkpoint-verifier.md
├── tests/test_checkpoint_verify.py
└── workflows/compact-reground-continue.md
```

## Installation
Python 3.10+. No third-party dependencies.

## Usage
`python scripts/checkpoint_verify.py checkpoint.json`

Checkpoint claims contain `id`, `text`, `critical`, `status`, and evidence references; loop state contains `attempt` and `max_attempts`.

## Workflow
Observe compaction → extract claims → classify critical claims → re-read external state → attach evidence → restore loop counters → run deterministic gate → repair at most twice → independent verification → continue or stop.

## Metrics
Unsupported critical claims, critical verification coverage, repeated-action count, failed-loop count, rework rate, and post-compaction task success.

## Verification
Run `python -m unittest tests/test_checkpoint_verify.py`. Critical verification coverage must be 100% before consequential continuation.

## Safety
The package does not request hidden chain-of-thought. It operates on explicit facts, claims, evidence, decisions, risks, and verification status. Dangerous or irreversible actions remain subject to surrounding human-approval policy.

## Failure handling
Maximum 2 verification-repair cycles. If critical claims cannot be grounded, stop and escalate rather than continue autonomously. Never weaken evidence requirements to force a pass.

## Definition of Done
**Implemented:** post-compaction gate integrated.  
**Measured:** coverage, contradiction, loop, and rework metrics collected.  
**Verified:** critical claims are grounded, loop bounds enforced, tests pass, and an independent verifier signs off.

## Customization
Teams may extend the critical-claim taxonomy for deployments, databases, issue trackers, or production state, while preserving the same fresh-evidence and bounded-loop requirements.
