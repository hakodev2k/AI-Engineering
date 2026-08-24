# Subagent Model Rate-Limit Governor

## Topic
Capacity-aware admission and retry control for parallel model-backed subagents.

## Category
Performance

## Problem
Parallel agent fan-out can overload a single provider/model quota bucket, causing HTTP 429 bursts, synchronized retries, empty child outputs, and worse end-to-end latency.

## Evidence
See `evidence/research.md` for August 2026 GitHub Copilot CLI/SDK signals and current GitHub usage-limit guidance.

## Existing approach
Provider throttling, generic exponential backoff, static fan-out caps, and manual model switching.

## Existing limitations
Those controls are commonly disconnected from orchestration-level knowledge of the actual model bucket, aggregate in-flight load, child retry synchronization, and fallback compatibility.

## Proposed improvement
Measure first, then gate each child by `(provider, model, quota-domain)`, centralize throttle feedback, honor `Retry-After`, bound attempts, jitter retries, and permit fallback only through explicit compatibility policy.

## Architecture
```text
subagent-model-rate-limit-governor/
├── README.md
├── evidence/research.md
├── skills/rate-limit-baseline-analysis.md
├── rules/model-bucket-backpressure.md
├── subagents/rate-limit-investigator.md
├── workflows/measure-govern-verify.md
├── hooks/pre-dispatch-capacity-check.md
├── scripts/analyze_rate_limits.py
└── tests/test_analyze_rate_limits.py
```

## Installation
Requires Python 3.9+ for the analyzer. Runtime integration is host-specific and should implement the hook/rules contract without altering existing security gates.

## Configuration
Define per-bucket initial concurrency, max attempts, acceptable p95 regression, quota-domain keying, and an allowlist of capability-compatible fallback models. Conservative default: no automatic fallback.

## Usage
Capture JSONL request events with `timestamp`, `child_id`, `provider`, `model`, `status_code`, and `latency_ms`; optional fields are `attempt`, `retry_after_ms`, and `quota_domain`.

Run:

`python scripts/analyze_rate_limits.py trace.jsonl --json`

Exit codes: `0` acceptable throttle density (<=10%), `1` throttle density above 10% in any bucket, `2` invalid input/runtime error.

## Workflow
Follow `workflows/measure-govern-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Implement → Measure again → Independently verify.

## Metrics
Child completion rate, p50/p95 latency, 429 rate, retries/completion, requests/completion, peak in-flight per bucket, fallback count.

## Verification
Run `python -m pytest tests/test_analyze_rate_limits.py`. Production verification additionally requires before/after traces from the same workload and confirmation that no forbidden fallback or security-policy change occurred.

## Safety
Do not defeat provider rate limits, rotate identities to evade quotas, weaken approval gates, or substitute a cheaper/different model when task capability requirements would change.

## Failure handling
Detection: analyzer or benchmark misses thresholds. Evidence: retain traces and comparison. Retry: at most two policy revisions. Fallback: queue at lower concurrency. Escalation: provider/account capacity owner. Stop: no measurable gain or capability/security regression.

## Definition of Done
**Implemented:** host enforces bucket admission, cooldown, and attempt bounds. **Measured:** representative baseline and post-change traces exist. **Verified:** useful completion is equal/better, throttle/retry amplification is lower, p95 is within threshold, tests pass, and model/security constraints are preserved.

## Customization
Tune bucket identity and AIMD-like concurrency logic to provider semantics, but keep the observable rules and bounded retry requirements intact.
