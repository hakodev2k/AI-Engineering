# Tool-Call Atomic Context Pruning

## Category
Token

## Problem
Token-budget logic often trims chat history by message count or approximate tokens. Tool-using histories are not flat text: an assistant tool-call request and its tool-result messages form a protocol transaction. Cutting inside that transaction can create malformed context, provider 400 errors, broken resumes, retries, and session resets.

## Evidence
See `evidence/research.md`. Current public signals include n8n issues #34166 and #33431 (July 2026), Hermes Agent issue #57039, and LangChain documentation for invalid chat/tool history and short-term-memory trimming constraints.

## Existing approach and limitation
Keep-last-N, raw token slicing, and post-error repair reduce context but can break structural invariants. Provider-specific sanitizers may run only on selected paths. Stub-result repair can hide lost state. A successful token reduction is not useful if it corrupts the next model request.

## Proposed improvement
Validate history, construct atomic protocol units, prune oldest unprotected complete units, reserve output capacity, validate again, then run quality regressions. If the budget cannot be met without deleting protected context, return an explicit budget failure instead of unsafe trimming.

## Architecture
- `evidence/research.md` — observed evidence, interpretation, gaps, root causes, metrics.
- `config/budget.example.json` — conservative input/output budget example.
- `scripts/context_pruner.py` — deterministic validator + atomic-unit pruner.
- `tests/test_context_pruner.py` — structural and budget regression tests.
- `skills/context-integrity-analysis.md` — reusable measurement and diagnosis procedure.
- `rules/tool-sequence-atomicity.md` — enforceable pruning invariants.
- `subagents/context-integrity-verifier.md` — independent verification role.
- `workflows/prune-and-verify.md` — bounded measure/optimize/verify flow.
- `hooks/pre-model-context-check.md` — deterministic pre-model gate.

## Installation
Python 3.10+; no third-party dependencies. Copy `config/budget.example.json` to `config/budget.json` and set the budget to the real invocation path's effective context limit, not a UI-advertised value that may differ from provider limits.

## Input format

```json
{
  "messages": [
    {"role":"user","content":"Check weather"},
    {"role":"assistant","content":"","tool_calls":[{"id":"call_1","name":"weather"}]},
    {"role":"tool","tool_call_id":"call_1","content":"Sunny"}
  ]
}
```

## Usage

```bash
python3 scripts/context_pruner.py context.json --config config/budget.json --output pruned.json
```

Exit `0` means valid output within budget. Exit `2` means invalid history/configuration. Exit `4` means protected context prevents meeting the budget safely.

The default token estimate uses serialized-character count divided by `chars_per_token_estimate`. Production integrations SHOULD replace/augment this with provider/model token accounting when available; the structural atomicity rules remain the same.

## Workflow
Follow `workflows/prune-and-verify.md`: Observe → measure baseline → validate → form atomic units → prune oldest unprotected units → measure again → regression test → independent verification. At most two optimization strategies are attempted per run.

## Metrics
Measure actual/estimated tokens per task, context utilization, units dropped, provider 4xx rate, orphan/unanswered tool-call count, cost/latency where available, representative task quality, and regression rate.

## Verification
Run:

```bash
python3 -m unittest tests/test_context_pruner.py
```

Then run provider-compatible fixtures and representative agent tasks before/after pruning. Token reduction alone is insufficient: structural validity and accepted task quality must both pass. Independent verification is specified in `subagents/context-integrity-verifier.md`.

## Safety and correctness
The package intentionally fails closed on malformed input history and does not synthesize missing tool results. Never delete system/security/current-goal context merely to hit a token target. Preserve the original session/checkpoint until the pruned version passes validation and regression checks.

## Failure handling
Detection: structural validator finding, provider schema error, budget-unmet status, or quality regression. Evidence: sanitized message metadata/IDs and metrics. Retry malformed context unchanged: zero. Maximum optimization strategies: two. Fallback: restore last valid context/checkpoint or route to retrieval/checkpoint/summarization using complete atomic units. Escalation: agent-runtime owner. Stop when only protected context remains or quality/safety would regress.

## Definition of Done
**Implemented:** all pruning/window-loading paths use atomic-unit validation. **Measured:** before/after token/context metrics and representative task outcomes are recorded. **Verified:** zero pruning-induced orphan/unanswered tool calls, zero schema errors attributable to pruning, measurable context reduction when required, protected context preserved, quality within threshold, and independent verifier has no blocking finding.

## Customization
Add provider-specific validators as additional gates, not replacements for generic tool-call atomicity. Summarizers may be added only if they consume/replace complete units and their summaries are regression-tested for critical-context loss.
