# Session Resume Context Rehydration Budget Guard

## Topic
Control the token, cache, and rediscovery cost of resuming long AI-agent sessions while preserving correctness-critical continuity.

## Category
Token

## Problem
Resumed coding-agent sessions may resend large static context, recreate expired prompt caches, and spend tool calls rediscovering state already known before interruption. The result can be high token/quota cost and latency without new value.

## Evidence
See `evidence/research.md`. Recent 2026 Claude Code reports document full startup/context resend after interruption, expensive parked-session resume, repeated instruction cache consumption, and cache-TTL-driven cache recreation.

## Existing approach
Prompt caching, full-history replay, handoff/state files, memory summaries, context compaction, and manual new-session restarts.

## Existing limitations
Cache TTL may expire; independently composed startup layers duplicate content; summaries may omit constraints; tool-derived facts often lack freshness/provenance and must be rediscovered; cost is generally visible after resume rather than before.

## Proposed improvement
A deterministic resume preflight that inventories context, preserves mandatory state, deduplicates equivalent static content, moves safe history to lazy loading, flags stale tool facts, and enforces a measurable token/rediscovery budget.

## Architecture
- `evidence/research.md` — current signals, approaches, limitations, root causes.
- `config/budget.json` — token, lazy-load, retry, and critical-field policy.
- `rules/resume-context-budget.md` — enforceable continuity and budget rules.
- `skills/build-safe-resume-bundle.md` — reusable analysis/optimization procedure.
- `subagents/resume-verification-agent.md` — independent quality verifier.
- `workflows/measure-optimize-verify-resume.md` — baseline/optimize/measure workflow.
- `scripts/resume_budget.py` — deterministic deduplication and safe-bundle builder.
- `tests/test_resume_budget.py` — regression fixtures.

## Installation
Python 3.10+ for the script. Install `pytest` only to run tests. For accurate provider billing/token numbers, integrate provider tokenizer or usage telemetry; the built-in estimator is deliberately labeled approximate.

## Configuration
Edit `config/budget.json` for your model/window and workflow. Keep all correctness/security fields in `critical_sections`. Put only reproducible, low-risk history in `lazy_sections`.

## Usage
Prepare context records:

```json
{"items":[{"id":"goal","section":"active_goal","content":"Implement and verify change X","critical":true,"source":"handoff"}]}
```

Run:

```bash
python3 scripts/resume_budget.py context.json --policy config/budget.json --out resume-plan.json
```

Exit codes: `0` fits; `3` valid optimized plan with lazy items; `4` critical context alone exceeds budget; `2` invalid input/config.

Run tests:

```bash
python -m pytest tests/test_resume_budget.py
```

## Workflow
Observe → measure full-context baseline → diagnose duplicates/staleness/cache effects → hypothesize safe lazy-loading → build optimized bundle → measure again → bounded replan if needed → independent verification.

## Metrics
Input tokens/resume, cache creation/read tokens, latency, duplicate tokens removed, lazy-loaded tokens, rediscovery calls, critical-field recall, result-quality regression rate.

## Verification
Compare the optimized run with a full-context reference on the same acceptance fixture. Critical-field recall must be 100%, acceptance behavior must match, and no destructive/high-impact action may rely on stale state.

## Safety
Never optimize away the active goal, acceptance criteria, security constraints, approvals, unresolved failures, or current workspace state. Never treat approximate token estimates as provider billing facts. Never suppress needed revalidation for token savings.

## Failure handling
Detection: critical content exceeds budget, quality regression, stale required facts, excessive rediscovery, or exhausted cache benefit. Evidence: before/after token/call/quality reports. Retry: maximum two changed-hypothesis replans. Fallback: full safe context or larger context window. Escalation: context/platform owner. Stop: missing critical field, stale high-impact state, or exhausted retries.

## Definition of Done
**Implemented:** preflight and policy integrated. **Measured:** full and optimized runs report token/call metrics. **Verified:** critical recall is 100%, reference quality is preserved, target token reduction is measured rather than assumed, rediscovery is bounded, and independent verification passes.

## Customization
Replace the approximate token estimator with a provider tokenizer adapter and extend item metadata with timestamps/content hashes/tool provenance. Keep the same fail-safe rule: critical correctness context wins over token savings.
