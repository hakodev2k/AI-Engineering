# Auto-review Failure Amplification Guard

**Category:** Token

## Problem
Persistent sandbox/tool failures can transform routine in-workspace actions into repeated escalated Auto-review model calls. Fresh Windows and Linux Codex reports show hundreds of reviews, almost all allowed, with very large reviewer-token totals.

## Evidence
See `evidence/research.md`. The package separates observed public evidence from interpretation and the proposed guard.

## Existing approach and limitation
Normal approval review is correct for genuine permission crossings. The failure occurs when an internal sandbox problem repeatedly makes an operation *appear* to need escalation. Denial-oriented breakers are insufficient because the repeated reviews are usually allowed.

## Proposed improvement
Use a privacy-safe failure fingerprint and a bounded per-session repeat budget before automatic review. After three equivalent expected-in-sandbox failures in 30 minutes, stop automatic re-review, perform at most one sandbox-health validation, and require human remediation if the environment remains unhealthy. New or broader boundary crossings still follow normal approval review.

## Architecture
- `skills/review-amplification-analysis.md` — reusable diagnosis procedure.
- `rules/review-budget-rules.md` — enforceable safety/token rules.
- `subagents/amplification-investigator.md` — baseline/root-cause role.
- `subagents/verification-agent.md` — independent verifier.
- `workflows/detect-bound-recover.md` — bounded operational flow.
- `hooks/pre-review-gate.md` — deterministic integration point.
- `scripts/review_amplification_guard.py` — executable gate and privacy-safe counter state.
- `tests/test_review_amplification_guard.py` — regression tests.
- `evidence/research.md` — current evidence and source links.

## Installation
Requires Python 3.10+ and no third-party packages. Copy this directory into the agent/runtime repository. Persist the state JSON in a runtime-owned directory that is not model-editable.

## Configuration
Recommended defaults: `max-repeats=3`, `window-minutes=30`. Tune only from measured traces. The threshold limits *automatic review of an equivalent expected-in-sandbox failure*; it does not authorize execution.

## Usage
Prepare an event JSON described in the script docstring, then run:

`python scripts/review_amplification_guard.py gate --event event.json --state runtime-review-state.json --max-repeats 3 --window-minutes 30`

Exit 0 allows the ordinary reviewer pipeline to continue. Exit 2 blocks repeated automatic review and triggers health/remediation handling. Exit 1 is invalid or ambiguous input and fails closed.

## Workflow
Observe -> measure review/token baseline -> classify failure -> fingerprint -> gate -> breaker -> one health check -> recover or human escalation -> measure again -> independent verification.

## Metrics
Track review calls/task, repeated-review ratio, reviewer input tokens/task and/fingerprint, breaker activations, false-positive blocks, legitimate boundary-review coverage, task latency, and quality regressions.

## Verification
Run `python -m unittest tests/test_review_amplification_guard.py`. Replay a real or sanitized trace and verify that equivalent internal failures stop generating automatic review after the threshold while distinct boundary crossings still reach the reviewer.

## Safety
The guard never grants permission, never executes a fallback outside the sandbox, and never stores raw prompts, credentials, or full target paths in its state. Unknown scope fails closed to human handling.

## Failure handling
Detection: non-zero hook exit, abnormal review ratio, or sandbox-health failure. Evidence: event envelope, fingerprint, counts, token metrics. Retry: one sandbox-health retry; at most two guard-tuning experiments. Fallback: ordinary human review/remediation. Stop: persistent unhealthy sandbox, ambiguous permission, or failed verification.

## Implemented / Measured / Verified
**Implemented:** deterministic fingerprint/budget gate, hook contract, rules, workflow, tests.
**Measured:** public evidence contains quantified failure amplification; adopters must establish their own baseline before deployment claims.
**Verified:** package-level unit verification is defined; production improvement is verified only after before/after replay or telemetry shows reduced review/token amplification with unchanged approval-boundary coverage.

## Definition of Done
Evidence documented; baseline captured; guard integrated; equivalent retries bounded; legitimate boundary reviews preserved; token/review metrics compared; tests pass; no secret data persisted; independent verification complete; no blocking safety issue remains.

## Customization
Extend normalization only with coarse, privacy-safe operation/failure classes. If adding cross-session persistence, add TTL and user/account partitioning; never share approval-state fingerprints across security principals.