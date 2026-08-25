# Context Introspection Metering Cache Guard

## Topic
Measure, cache, and budget auxiliary context/token introspection calls in AI-agent runtimes.

## Category
Token

## Problem
Context gauges and SDK helpers can look like local metadata reads while adapters actually perform remote token-count or minimal inference requests. With many tools, skills, memories, or agents, one inspection may fan out across context items. Repeating that work every turn can create hidden tokens, latency, and cost outside normal run telemetry.

## Evidence
See `evidence/research.md`. Current August 2026 reports include Claude Agent SDK issue #1159, Claude Code issue #86628, and Hermes Agent issue #87450, plus official provider/SDK documentation on token-count and usage APIs.

## Existing approach
Provider token-count endpoints, SDK context helpers, per-run usage objects, prompt caching, and provider billing logs.

## Existing limitations
Callers cannot safely assume introspection is local/free/cached; fixed context components may be recounted repeatedly; stream telemetry can omit auxiliary requests; and turning context measurement off entirely removes useful context-pressure safeguards.

## Proposed improvement
Place context introspection behind a separately metered cache/budget layer. Fingerprint stable context definitions, cache by provider/model/fingerprint, invalidate only on relevant changes, trigger refresh from context-definition changes where possible, and reconcile local auxiliary telemetry against provider records.

## Architecture
- `evidence/research.md` — public signals, existing approaches, root causes.
- `rules/introspection-budget.md` — enforceable metering/cache rules.
- `skills/measure-and-cache-introspection.md` — measure/diagnose/optimize procedure.
- `subagents/token-verifier.md` — independent verifier.
- `workflows/measure-optimize-verify.md` — bounded benchmark workflow.
- `hooks/preflight-introspection-budget.md` — budget gate contract.
- `scripts/introspection_analyzer.py` — dependency-free JSONL analyzer.
- `tests/test_introspection_analyzer.py` — deterministic regression tests.

## Actual package tree
```text
context-introspection-metering-cache-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── preflight-introspection-budget.md
├── rules/
│   └── introspection-budget.md
├── scripts/
│   └── introspection_analyzer.py
├── skills/
│   └── measure-and-cache-introspection.md
├── subagents/
│   └── token-verifier.md
├── tests/
│   └── test_introspection_analyzer.py
└── workflows/
    └── measure-optimize-verify.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Instrument auxiliary context/token-count calls as JSONL with: `turn`, `provider`, `model`, `fingerprint`, `input_tokens`, `latency_ms`, `cache_hit`; optionally `cost_usd` and `kind`.

Cache keys SHOULD include provider, model, serialization/tokenization version, and a hash of the exact stable context definition. Do not reuse counts across incompatible models/providers.

## Usage
Run tests:

`python -m unittest discover -s tests -p 'test_*.py'`

Analyze a trace:

`python scripts/introspection_analyzer.py optimized.jsonl --compare baseline.jsonl --max-requests-per-turn 5 --max-input-tokens-per-turn 20000`

Exit codes: `0 valid/within budget`, `3 budget breach`, `4 invalid trace`.

## Workflow
Observe → measure baseline → diagnose repeated remote counts/telemetry gaps → form cache hypothesis → implement → measure again → retry at most twice if no improvement → regression checks → independent verification.

## Metrics
Requests/turn, auxiliary input tokens/turn, cost/task, latency, cache-hit rate, repeated fingerprints, provider-vs-local request/cost delta, context-overflow regression rate, result-quality regression rate.

## Verification
### Implemented
Auxiliary introspection is separately instrumented and stable definitions can be cached.

### Measured
Comparable before/after task traces exist.

### Verified
- Unchanged provider/model/fingerprint produces cache reuse.
- Changed model or context fingerprint is treated as distinct/invalidation-worthy.
- Auxiliary requests/tokens/cost or latency measurably decrease.
- Context-pressure behavior does not become stale or unsafe.
- Provider/local telemetry is reconciled or any gap is explicitly explained.
- Independent verifier approves.

## Safety
Never delete correctness-critical context to hit a token target. Never disable context-window guards merely because introspection is costly. Treat missing telemetry as unknown, not zero.

## Failure handling
Detection: analyzer budget breach, repeated uncached fingerprint, provider/local reconciliation gap, or stale-cache test. Evidence: JSONL traces and provider records. Retry: at most two optimization iterations. Fallback: last-known-good safe measurement or less frequent/event-driven refresh. Escalation: provider/adapter owner. Stop: correctness regression, missing baseline, invalid telemetry, or exhausted retries.

## Definition of Done
Evidence documented; baseline captured; existing limitations identified; cache/metering improvement implemented; deterministic tests pass; before/after metrics collected; provider/local gap accounted for; no context correctness regression; independent verification complete; no blocking issue remains.

## Customization
Budgets are deployment-specific. Set them from measured workloads rather than arbitrary global constants, and preserve invalidation correctness before maximizing hit rate.