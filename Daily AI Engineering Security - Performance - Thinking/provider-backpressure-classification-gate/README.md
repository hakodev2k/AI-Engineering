# Provider Backpressure Classification Gate

## Topic
Classify LLM capacity/backpressure signals before retry, wait, or fallback

## Category
Performance

## Problem
Generic handling of 429/503/529 can retry too quickly, ignore `Retry-After`, trigger pointless fallback during local admission pressure, or fail to use fallback during real upstream capacity events.

## Evidence
`evidence/research.md` documents current 2026 signals from Hermes Agent and DeerFlow showing local admission, upstream capacity, burst-rate, and fallback-classification failures.

## Existing approach
Fixed retry counts, exponential backoff, generic 429/5xx handling, fallback chains, and circuit breakers.

## Existing limitations
Status-only policy loses structured error scope; multiple retry layers can disagree; local and upstream capacity require different actions; synchronized retries can amplify burst controls.

## Proposed improvement
Preserve structured error metadata and classify recovery before any retry/fallback action. Use one cumulative attempt/time budget and explicit action classes: wait, backoff, fallback, or fail.

## Architecture
- `evidence/research.md` — public evidence, existing approaches, root causes.
- `skills/backpressure-baseline-and-classification.md` — baseline and diagnosis procedure.
- `rules/recovery-policy.md` — enforceable retry/fallback invariants.
- `subagents/performance-verifier.md` — independent metrics/policy verifier.
- `workflows/measure-classify-recover-verify.md` — bounded improvement flow.
- `hooks/pre-retry-classification.md` — deterministic integration point.
- `scripts/backpressure_classifier.py` — standard-library classifier.
- `tests/test_backpressure_classifier.py` — replay regression tests.

## Actual package tree
```text
provider-backpressure-classification-gate/
├── README.md
├── evidence/research.md
├── hooks/pre-retry-classification.md
├── rules/recovery-policy.md
├── scripts/backpressure_classifier.py
├── skills/backpressure-baseline-and-classification.md
├── subagents/performance-verifier.md
├── tests/test_backpressure_classifier.py
└── workflows/measure-classify-recover-verify.md
```

## Installation
Python 3.10+; no third-party dependency. Copy the package directory and wire the hook before the host's retry/fallback decision.

## Configuration
Each event should include status, optional structured code, `retry_after`, attempt, elapsed time, max attempts, max elapsed time, and whether a compliant fallback is available. Extend code sets for provider-specific signals only with trace evidence.

## Usage
```bash
python scripts/backpressure_classifier.py --input failure.json
```

Optional bounded jitter for replay/host integration:
```bash
python scripts/backpressure_classifier.py --input failure.json --max-jitter 1.0
```

Exit `0` means a bounded recovery action is available; exit `2` means fail/stop; exit `1` means malformed input/configuration.

## Workflow
Follow `workflows/measure-classify-recover-verify.md`: baseline → diagnose scope → hypothesis → implement classifier → replay identical fixtures → compare metrics → independent verification.

## Metrics
Attempts/turn, P50/P95 recovery latency, `Retry-After` compliance, fallback success, request burst coefficient, and capacity-related terminal failure rate.

## Verification
Run:
```bash
python -m unittest tests/test_backpressure_classifier.py
```

Performance is **Implemented** when classification owns the protected retry path, **Measured** when baseline and after-state metrics exist, and **Verified** when deterministic replay plus independent review confirm reduced amplification without correctness/security regressions.

## Safety
This package does not bypass quotas, authentication, provider policy, model constraints, or approval boundaries. Fallback must remain inside the host's existing security/data/quality allowlist.

## Failure handling
Unknown events use conservative bounded recovery. Retry policy changes at most twice during an improvement cycle. If metadata cannot be preserved or metrics regress, revert to the previous bounded policy and escalate; never remove stop conditions.

## Definition of Done
- Current evidence documented.
- Baseline measured.
- Error metadata preserved.
- One cumulative recovery budget enforced.
- Replay tests pass.
- After-state metrics collected.
- Independent verifier passes.
- Security/data/model constraints preserved.
- No unbounded recovery path remains.

## Customization
Add provider-specific codes only when their scope and expected recovery are documented. Keep local-admission, provider-capacity, burst-rate, ordinary rate-limit, and unknown classes separate.
