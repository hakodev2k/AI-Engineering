# Reasoning Visible Completion Contract

**Category:** Thinking  
**Run date:** 2026-08-30 (UTC+7)

## Problem
Reasoning-capable models and agent adapters can report a nominally successful terminal state while producing no user-visible answer, tool action, or structured result. If the runtime equates `finish_reason=stop` with task completion, a reasoning-only or empty response becomes a silent success. Other runtimes retry blindly and can burn multiple full reasoning budgets without converging.

## Evidence
See `evidence/research.md`. Current independent signals include AgentScope Java issue #2750 (August 17, 2026), OpenAI Codex issue #37879 (August 10, 2026), LM Studio issue #1602, and Hermes Agent issue #83915 (August 11, 2026).

## Existing approach
Frameworks commonly trust provider finish/stop reasons, add empty-response retries, or use middleware/fallback models. AgentScope's issue proposes a post-reasoning visible-content check with bounded continuation; structured-output systems already demonstrate that response shape can be validated independently of model reasoning.

## Remaining limitation
A blanket “non-empty text required” rule is wrong for legitimate tool calls, structured results, and intentional no-reply decisions. Unlimited retries are also wrong: a reasoning-only failure can recur deterministically and consume time/tokens without adding evidence.

## Proposed improvement
Define completion as an observable contract. A terminal turn is complete only if it contains an allowed visible outcome: text, tool call, structured result, or an explicitly modeled no-reply outcome. `length`/truncation is never success. Empty terminal stops trigger a bounded recovery; after the retry budget is exhausted, the runtime emits an explicit failure instead of silent success.

## Package tree
```text
README.md
evidence/research.md
config/completion-policy.example.json
skills/completion-contract-analysis.md
rules/visible-completion-rules.md
subagents/verification-agent.md
workflows/detect-recover-verify.md
hooks/post-response-completion-check.md
scripts/validate_response_trace.py
tests/test_validate_response_trace.py
```

## Installation
Python 3.10+; standard library only.

## Usage
```bash
python scripts/validate_response_trace.py trace.jsonl --policy config/completion-policy.example.json
python -m unittest tests/test_validate_response_trace.py
```

## Metrics
Silent-empty-success rate; reasoning-only terminal rate; truncation rate; recovery success rate; retries per failed turn; time/tokens spent on recovery; visible completion rate; false-positive rejection rate for tool/structured/no-reply outcomes.

## Verification
**Implemented:** explicit completion predicate and bounded retry policy. **Measured:** traces before/after use the same representative workload. **Verified:** silent terminal empties become recovered valid results or explicit failures, with no valid tool/structured/no-reply outcomes incorrectly blocked.

## Safety
Do not request, persist, or expose hidden chain-of-thought. Validation uses only observable response fields and metadata. Do not weaken output validation merely to reduce retries.

## Failure handling
Retry a recoverable empty terminal at most the configured number of times (default 2). Repeated identical failures stop and surface evidence. Provider/protocol incompatibility is escalated rather than hidden behind infinite continuation.

## Definition of Done
Evidence documented; baseline traces captured; completion classes defined; validator/tests pass; bounded recovery implemented; before/after metrics collected; legitimate non-text outcomes covered; independent verifier approves; no hidden reasoning content is required for correctness.
