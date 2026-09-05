# Parallel Tool Result Integrity Gate

**Category:** Thinking  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Agent runtimes increasingly execute multiple tool calls in one model turn, but several current frameworks have lost, dropped, or mis-correlated results when calls are parallelized or combined with approval/resume flows. The failure can be silent: the model receives incomplete state, retries valid work, loops, or reaches an unsupported conclusion.

## Evidence
See `evidence/research.md`. Current independent signals include Hermes Agent, n8n, Google ADK, OpenAI Agents Python, Microsoft Agent Framework, and Haystack reports from 2026.

## Existing approach and limitation
Prompt guidance, global step limits, provider-specific parallel flags, and framework-level retry logic reduce some failures. They do not prove that every emitted tool call receives exactly one correctly correlated result before the next reasoning step. A successful HTTP/model response is therefore not sufficient evidence of state integrity.

## Proposed improvement
Introduce an observable turn-integrity contract. Before the agent may advance, every tool call ID in a turn must be accounted for by exactly one terminal result or explicit denied/cancelled state. Enforce configurable batch limits, preserve call/result correlation across pause-resume boundaries, and fail visibly rather than silently discarding state.

## Package tree
- `README.md`
- `evidence/research.md`
- `skills/parallel-turn-integrity-analysis.md`
- `rules/tool-result-integrity.md`
- `subagents/integrity-verifier.md`
- `workflows/diagnose-remediate-verify.md`
- `hooks/post-tool-batch.md`
- `scripts/verify_tool_batch.py`
- `config/policy.example.json`
- `tests/test_verify_tool_batch.py`

## Installation
Python 3.10+, standard library only.

## Configuration
Set `max_parallel_calls`, `require_terminal_result`, and allowed terminal statuses in `config/policy.example.json`. Runtime adapters should emit JSON with `calls` and `results` containing stable `call_id` values.

## Usage
`python scripts/verify_tool_batch.py config/policy.example.json <turn.json>`

Exit 0 means the turn is structurally complete. Exit 4 means a blocking integrity violation. Exit 1 means malformed input/configuration.

## Workflow
Observe trace -> capture baseline loss/retry behavior -> map call IDs -> form failure hypothesis -> instrument/repair runtime -> replay fixtures -> measure retries, lost results, and completion -> independent verification.

## Metrics
Missing-result rate; duplicate-result rate; unknown-result rate; maximum parallel batch; retries caused by result loss; tool calls/task; tokens/task; time-to-completion; task success; unsupported-conclusion rate.

## Verification
**Implemented:** deterministic checker, rules, bounded workflow, tests.  
**Measured:** before/after traces use the same workload and report structural integrity plus cost/latency.  
**Verified:** known failure fixtures are blocked; valid parallel batches pass; every call is terminally accounted for; an independent reviewer confirms no silent-loss path remains.

## Safety
Do not fabricate tool outputs to make a batch complete. Missing state must block progression or trigger bounded recovery. Approval-gated and irreversible tools retain their human approval requirements.

## Failure handling
On a violation, capture the raw turn, stop model progression, and retry the transport/resume operation at most once when idempotent. If correlation is still incomplete, stop and escalate. Never re-execute non-idempotent tools automatically unless the runtime has a verified idempotency key or explicit approval.

## Definition of Done
Evidence documented; baseline captured; call/result contract defined; checker and tests pass; no missing/duplicate/unknown results in verification traces; retry behavior bounded; approval semantics preserved; before/after metrics collected; independent verification complete.

## Customization
Adapters may translate framework-specific events into the canonical turn schema. Keep stable call IDs and explicit terminal states; do not infer success from ordering alone.