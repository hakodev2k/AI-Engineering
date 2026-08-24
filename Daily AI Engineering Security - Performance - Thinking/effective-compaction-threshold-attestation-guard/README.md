# Effective Compaction Threshold Attestation Guard

**Category:** Token

## Problem
A configured compaction threshold can differ from the trigger the active runtime actually enforces. Silent floors, model metadata fallbacks, provider limits, and large-window ratio scaling can invalidate token/cost policy while configuration still looks correct.

## Evidence
`evidence/research.md` documents current 2026 signals, including silent 60%→75% threshold clamping, unreachable or oversized triggers, recommendation/runtime disagreement, and configured-vs-runtime context divergence.

## Existing approach
Agent runtimes typically expose compression ratios, model context metadata, status views, manual compaction and warnings.

## Existing limitations
These surfaces can report source configuration rather than resolved execution policy. Ratio-only thresholds also become very large on 1M-context models, and warnings may be computed independently from the active compactor.

## Proposed improvement
Treat the effective context window and effective compaction threshold as first-class runtime attestations. Compare them with configured intent, enforce approved ratio divergence and optional absolute token ceilings, and re-attest whenever runtime identity/state changes.

## Architecture
- `evidence/research.md` — current evidence, limitations and root causes.
- `skills/effective-threshold-attestation.md` — reusable measurement procedure.
- `rules/compaction-budget-rules.md` — observable token-policy invariants.
- `subagents/token-budget-verifier.md` — independent verifier.
- `workflows/measure-tune-verify.md` — bounded measure/diagnose/tune/re-measure workflow.
- `hooks/session-threshold-attestation.md` — lifecycle enforcement hook.
- `scripts/attest_compaction_threshold.py` — dependency-free attestation checker.
- `tests/test_attest_compaction_threshold.py` — regression fixtures.

## Installation
Python 3.9+; no third-party runtime dependencies. Copy the whole directory to the target project.

## Configuration
The host supplies an input JSON with:
- `effective_context_tokens`
- `effective_threshold_tokens`
- optional `configured_ratio`
- optional `max_ratio_delta` (default `0.05`)
- optional `max_threshold_tokens`
- optional `block_on_ratio_delta` (default `true`)

The effective values must come from the active runtime after all policy resolution, not only from static config.

## Usage
`python3 scripts/attest_compaction_threshold.py attestation-input.json`

Run tests:
`python3 -m pytest tests/test_attest_compaction_threshold.py`

## Workflow
Observe → measure baseline → diagnose configured/effective divergence → hypothesize bounded policy adjustment → implement → measure again → one bounded retry if needed → independent verification.

## Metrics
Tokens/task, effective threshold tokens/ratio, configured/effective ratio delta, compactions/session, p50/p95 latency, rate-limit incidents, context utilization, and quality regression rate.

## Verification
**Implemented:** attestation script, rules, workflow, hook and tests are present.

**Measured:** the target runtime must capture before/after token and latency metrics; configuration values alone do not count as measurement.

**Verified:** included fixtures must detect a silent 60%→75% clamp and an oversized 500K threshold while allowing a matching threshold. Integration verification must additionally prove re-attestation after model/provider/session changes and no critical quality regression.

## Safety
Never delete context required for correctness merely to satisfy a budget. This package verifies policy state; it does not autonomously force destructive compaction or change production configuration.

## Failure handling
Detection: nonzero attestation exit. Evidence: reason-coded effective values. Retry: refresh runtime state once. Maximum retries: one. Fallback: retain safe current context and mark budget compliance unverified. Escalation: token/platform owner. Stop: unresolved effective state remains BLOCK.

## Definition of Done
- Current evidence documented.
- Configured and effective values separated.
- Effective context and threshold measured at runtime.
- Divergence is reason-coded.
- Optional absolute ceiling enforced where required.
- Baseline and post-change token/latency metrics collected.
- Quality regression checks pass.
- Lifecycle changes invalidate old attestation.
- Tests and independent verification pass.
- No critical context is removed merely for savings.

## Customization
Set tolerance and absolute threshold ceiling from workload SLOs. Providers with known rate-limit or prefill constraints can add stricter ceilings, while high-recall tasks can choose a larger approved budget if quality evidence supports it.
