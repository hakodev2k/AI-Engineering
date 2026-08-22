# Token Telemetry Semantics Guard

**Category:** Token  
**Run date:** 2026-08-22 (UTC+7)

## Problem
Long-running AI-agent systems may expose current-context usage, cumulative session consumption, cached input, and local estimates through overlapping or ambiguous names. That ambiguity can mislead operators and cause automated compaction/routing logic to act on the wrong counter.

## Evidence
See `evidence/research.md`. Fresh August 2026 Codex reports independently document lifetime token totals being mistaken for active context, missing raw active-context counters, and a bytes/4 estimate overwriting measured usage after compaction.

## Existing approach and limitations
Single `tokens_used` fields, percentage-only displays, local byte/character approximations, and cumulative usage ledgers are useful for individual purposes but unsafe when their semantics are not explicit. An estimate can also drift by language/content and must not silently supersede provider measurements.

## Proposed improvement
Adopt a canonical telemetry contract separating current context, cumulative session usage, cached input, measured values, estimates, and measurement provenance. Validate bounds and monotonicity before token telemetry drives context-management automation.

## Architecture
```text
raw provider/local token events
  -> semantic mapping + provenance
  -> canonical JSONL
  -> deterministic validation
  -> estimator-error + bounds checks
  -> safe/unsafe-for-automation decision
  -> independent verification
```

## Package tree
```text
README.md
evidence/research.md
config/policy.json
skills/token-telemetry-audit.md
rules/token-semantics.md
subagents/telemetry-verifier.md
workflows/measure-normalize-verify.md
hooks/pre-compaction-telemetry-check.md
scripts/token_telemetry_guard.py
scripts/test_token_telemetry_guard.py
tests/cases.json
```

## Installation
Requires Python 3.10+ and the standard library only. The scripts are local/read-only and require no API keys.

## Configuration
Tune `config/policy.json` for approved measurement sources and estimator error tolerance. Do not increase `max_estimator_relative_error` merely to make a known-bad estimator pass; replace or disable the estimator for automation instead.

## Usage
From this topic directory:

```bash
python3 scripts/token_telemetry_guard.py events.jsonl --policy config/policy.json --strict
python3 scripts/test_token_telemetry_guard.py
```

Canonical events require `event_id`, `current_context_tokens`, `model_context_window`, and `measurement_source`; optional fields capture session cumulative, cached input, measured/estimated current counts, session ID, and whether the event drives automation.

## Workflow
Follow `workflows/measure-normalize-verify.md`: capture a baseline, map field semantics, state a falsifiable root-cause hypothesis, normalize without overwriting raw telemetry, validate/replay, make the smallest supported fix, measure again, then obtain independent verification.

## Metrics
- Semantic/provenance coverage.
- Current-context utilization.
- Session cumulative usage.
- Cached-token ratio.
- Estimator mean/max relative error.
- Compaction/alert decision error rate.
- Violations that would have driven unsafe automation.

## Verification
**Implemented:** evidence, canonical rules, policy, deterministic validator, workflow, hook, tests, and independent verifier role are present.  
**Measured:** adopters must capture integration-specific baseline and post-fix results; this package does not claim production savings without those measurements.  
**Verified:** package-level verification requires `python3 scripts/test_token_telemetry_guard.py` to pass. Production verification additionally requires replaying representative pre/post-compaction and non-ASCII events and confirming all context decisions consume canonical current-context values.

## Safety
The package does not delete context or change compaction thresholds automatically. It blocks ambiguous telemetry from driving automation rather than sacrificing context needed for correctness. Raw telemetry is preserved for diagnosis.

## Failure handling
Detection: strict validator exit 3, invalid input exit 2, excessive estimator error, impossible context bounds, or ambiguous semantics.  
Evidence: retain normalized report plus raw source event IDs.  
Retry: at most two correction retries after the first measured fix.  
Fallback: provider-documented measured current-context fields or a validated tokenizer; otherwise disable automated compaction/routing based on the ambiguous metric.  
Escalation: platform/context-management owner.  
Stop condition: three measured fix attempts or unresolved provider semantics.

## Definition of Done
- Current evidence documented.
- Baseline captured in the adopting system.
- Every automation-relevant counter has explicit semantics and source provenance.
- Measured and estimated values remain distinct.
- Cumulative totals cannot drive active-context decisions.
- Estimator error measured where possible.
- Fixture/replay tests pass.
- Before/after metrics captured.
- Independent verifier confirms the mapping.
- No blocking telemetry ambiguity remains.

## Customization
Extend event ingestion adapters outside this package as needed, but normalize into the documented canonical fields before running the validator. Add language-specific/non-ASCII fixtures that reflect the workloads your agents actually process.
