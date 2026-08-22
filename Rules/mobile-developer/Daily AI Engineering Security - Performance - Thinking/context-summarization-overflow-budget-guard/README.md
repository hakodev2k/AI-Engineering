# Context Summarization Overflow Budget Guard

**Category:** Token

## Problem
Summarization can fail exactly when it is most needed: close to the context limit, the summarizer adds its own prompt, structured message metadata, tool-call fields, output reserve, and safety headroom. A history that appears to fit can therefore overflow during compaction.

## Evidence
See `evidence/research.md`. LangChain has documented metadata-triggered summarization overflow, and LangMem explicitly warns that failed trimming can fall back to an oversized original message list.

## Existing approach
Fixed thresholds, approximate token counting, keep-recent-N, trimming, summarization, and external memory.

## Existing limitations
They can omit envelope overhead, undercount metadata, split tool pairs, retry unchanged oversized payloads, or reduce tokens without verifying preservation of correctness-critical state.

## Proposed improvement
A deterministic full-envelope gate that reserves output/safety capacity, strips non-essential metadata first, preserves required IDs and tool pairs, bounds trim attempts, and blocks when required state cannot fit.

## Package tree
```text
README.md
evidence/research.md
config/token-policy.json
rules/context-budget-rules.md
skills/context-envelope-analysis.md
subagents/context-analyzer.md
subagents/verification-agent.md
workflows/profile-trim-summarize-verify.md
hooks/pre-summarization-budget-check.md
scripts/context_budget_guard.py
tests/test_context_budget_guard.py
```

## Installation
Python 3.10+; no third-party dependency is required by the deterministic guard/tests.

## Configuration
Set the actual model context limit, summary prompt estimate, reserved output tokens, safety margin, and trim attempts in `config/token-policy.json`. Replace the example defaults with measured values for the selected model/serializer.

## Usage
Prepare `envelope.json` using the schema described in `scripts/context_budget_guard.py`, then run:

```bash
python scripts/context_budget_guard.py envelope.json --policy config/token-policy.json
```

Exit codes: `0` allow, `2` invalid, `3` trim required, `4` block.

## Workflow
Follow `workflows/profile-trim-summarize-verify.md`: capture exact envelope → baseline → strip/trim → recount → summarize only when safe → independently verify retained state.

## Metrics
Summarization input tokens, usable-budget utilization, metadata reduction, compression ratio, overflow rate, required-context retention, quality regression, latency, and cost/task.

## Verification
Required IDs must be retained at 100%, tool-call/result relationships must remain valid, the projected envelope must fit the usable input budget, and quality/regression fixtures must pass.

## Safety
Token savings never justify dropping security policy, approval state, unresolved risk, evidence needed for verification, or required user constraints. If required state cannot fit, block and escalate to an approved context/memory strategy.

## Failure handling
Never retry an identical oversized envelope. Trimming is bounded. Required-context loss blocks the model call. Preserve original state externally before destructive compaction.

## Definition of Done
- **Implemented:** budget gate and hook integrated before summarization.
- **Measured:** exact before/after envelope budget captured.
- **Verified:** no overflow under fixtures, 100% required-context retention, structural checks pass, and task quality meets the pre-change acceptance threshold.

## Customization
Replace approximate counts with provider-native tokenization, add serializers for framework-specific message types, or store evicted content in retrievable external memory. Keep the full-envelope accounting and required-state checks intact.
