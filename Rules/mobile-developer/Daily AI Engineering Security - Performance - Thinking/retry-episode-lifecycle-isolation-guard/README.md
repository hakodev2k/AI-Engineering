# Retry Episode Lifecycle Isolation Guard

**Category:** Thinking

## Problem
Retry counters in agent runtimes can outlive the failure episode they were meant to bound, causing later unrelated failures to terminate early. The opposite lifecycle error—resetting too readily—can enable loops. Repeating the same recovery action can also waste tokens and calls without changing the outcome.

## Evidence
See `evidence/research.md`. Current evidence includes Hermes Agent #79100 on stale length-continuation accounting, Hermes Agent #20975 on ineffective identical truncated-tool retries, and independent Azure/AWS guidance requiring bounded operation-appropriate retry strategies.

## Existing approach
Per-turn/global retry counters, fixed retry limits, backoff, continuation prompts, and provider retry policies.

## Existing limitations
A retry counter can be bounded yet still incorrect if its reset boundary is ambiguous. Multiple agent failure classes frequently share overlapping state, and retries may not require a changed recovery hypothesis.

## Proposed improvement
Represent recovery as explicit observable episodes keyed by failure class, operation, and state fingerprint. Close/reset only on verified recovery, keep consecutive unresolved failures in one episode, require strategy change after repeated identical failure, and stop terminal/unsafe retries.

## Architecture
- `evidence/research.md` — evidence, existing approaches, limitations, root cause.
- `config/retry-policy.json` — bounded retry and episode policy.
- `skills/retry-episode-analysis.md` — reusable diagnostic procedure.
- `rules/retry-lifecycle.md` — enforceable invariants.
- `subagents/recovery-verifier.md` — independent verifier.
- `workflows/diagnose-fix-verify.md` — bounded diagnosis and verification flow.
- `hooks/pre-retry-episode-check.md` — pre-retry deterministic gate.
- `scripts/retry_episode_guard.py` — episode decision utility.
- `tests/test_retry_episode_guard.py` — lifecycle regression tests.

## Installation
Python 3.10+; install `pytest` for tests. Runtime script otherwise uses only the standard library.

## Configuration
Edit `config/retry-policy.json` for failure taxonomy and budgets. Terminal/unsafe classes should remain non-retryable. Side-effecting operations require an idempotency/status check in the integrating runtime.

## Usage
`python scripts/retry_episode_guard.py event.json --ledger ledger.json --policy config/retry-policy.json`

Exit codes: 0 retry/new/close episode; 2 invalid evidence; 3 strategy change required; 4 stop.

## Workflow
Observe → reconstruct episode baseline → diagnose lifecycle defect → form hypothesis → implement one change → replay separated/consecutive failures → independent verification. Maximum two implementation hypotheses.

## Metrics
Attempts per episode, stale-counter premature stops, identical-retry rate, successful recovery rate, recovery tokens/tool calls, and terminal-message accuracy.

## Verification
Run `pytest tests/test_retry_episode_guard.py`. Integration verification must include: non-consecutive failures get fresh budget after verified recovery; consecutive failures remain bounded; terminal failures never retry; repeated identical failures require changed strategy; side-effect boundaries remain preserved.

## Safety
No retry policy may bypass authorization, approval, unsafe-action, or idempotency constraints. The package records observable facts/actions/outcomes only and never requests hidden chain-of-thought.

## Failure handling
Detection uses episode ledger invariants. Retry policy is bounded. Maximum two lifecycle hypotheses during diagnosis. Fallback is controlled stop with the active episode evidence. Escalate when episode identity cannot be safely inferred. Never grant fresh retry budget by weakening classification.

## Definition of Done
**Implemented:** runtime maps retries to episode identity and enforces policy. **Measured:** before/after traces quantify attempts, premature stops, and recovery overhead. **Verified:** all regression cases pass independently, no stale budget crosses a verified recovery boundary, unresolved failures remain bounded, and no unsafe retry path is introduced.

## Customization
Add provider/tool-specific failure classes, richer state fingerprints, or telemetry exporters. Keep episode identity deterministic, lifecycle transitions observable, and retry loops bounded.
