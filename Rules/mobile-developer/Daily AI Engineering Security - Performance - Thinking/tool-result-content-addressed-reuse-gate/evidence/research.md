# Research — Tool Result Content-Addressed Reuse Gate

## Topic
Tool Result Content-Addressed Reuse Gate

## Category
Token

## Problem
AI coding/agent runtimes repeatedly execute read-only tools such as file reads, directory listings, diagnostics, repository inspection, and search. When the fresh output is unchanged, many runtimes still append and resend the complete payload to the model. This wastes input tokens, increases cache-read volume and latency, accelerates context compaction, and can trigger secondary compaction costs. Simply caching the tool execution is unsafe because underlying state can change; simply suppressing repeated calls can hide fresh state.

## Why it matters now
Recent 2026 reports across multiple agent runtimes independently show repeated unchanged reads and repeated tool payloads consuming large context/token budgets. Docker Agent issue #3939 proposes always re-executing read-only tools but eliding byte-identical fresh output. OpenAI Codex issue #33498 reports agents repeatedly rereading unchanged files already in context, with measurable token/context pressure. Hermes issue #84857 reports tool outputs being re-sent every turn and dedup state being lost across compaction, with cache-read volume 15–18x input in reported sessions.

## Affected users
AI coding-agent users, agent-runtime/platform engineers, multi-agent orchestrator authors, teams paying per-token API costs, and developers running long repository-analysis sessions.

## Current public evidence
1. Docker Agent issue #3939 (opened 2026-08-07) documents unchanged read-only tool results being re-sent in full, explains why execution caching is unsafe, and proposes fresh execution plus byte-identical output elision: https://github.com/docker/docker-agent/issues/3939
2. OpenAI Codex issue #33498 (opened 2026-07-16) reports repeated rereads of unchanged files already available in context, causing avoidable token use, latency, and context pressure: https://github.com/openai/codex/issues/33498
3. Hermes Agent issue #84857 (opened 2026-08-12) reports tool outputs riding history every turn, cache-read/input ratios around 15–18x in reported sessions, and read-file dedup state being lost across context compaction: https://github.com/NousResearch/hermes-agent/issues/84857
4. Hermes Agent issue #84187-equivalent compaction-thrashing reports in current agent ecosystems show large attachments/tool metadata refilling context immediately after compaction, demonstrating the downstream cost of repeated payload injection: https://github.com/anthropics/claude-code/issues/84187

## Observed evidence
Independent reports from Docker Agent, Codex, and Hermes describe the same recurring inefficiency: unchanged information is acquired or carried repeatedly and charged repeatedly. The reports also expose a correctness constraint: avoiding token duplication must not return stale data or assume content remains visible after compaction.

## Existing approaches
- Truncate large individual tool results.
- Cache entire agent question/answer pairs or provider prompt prefixes.
- Suppress repeated identical tool calls after a threshold.
- Context compaction/summarization after the context becomes large.
- Add prompting/rules asking the model not to reread unchanged files.
- Cache tool execution and invalidate on guessed file/resource changes.

## Remaining limitations
Truncation bounds one result but not repeated medium-sized results. Prompt/prefix caching may lower billing but still consumes context capacity and does not remove duplicated semantic payload. Tool-execution caching risks stale data when hidden dependencies change. Call suppression prevents fresh observation. Compaction is reactive, lossy, and costs another model call. Model instructions are probabilistic. A raw hash ledger can also become unsafe after compaction: the runtime may know a payload was shown earlier while the model's current context no longer contains it.

## Root-cause analysis
- Tool execution freshness and model-context duplication are often treated as one problem instead of separate concerns.
- Runtimes lack a content identity for deterministic read-only outputs.
- Runtimes often do not track whether the original payload is still visible in the active model context after pruning/compaction.
- Dedup state may live inside conversation history and disappear exactly when compaction happens.
- Tool annotations such as read-only/idempotent hints are not consistently used as hard eligibility constraints.
- Token telemetry frequently aggregates provider usage without attributing bytes/tokens to repeated tool-result identities.

## Improvement opportunity
Always execute eligible read-only tools to observe fresh state. Canonicalize and hash the fresh result together with tool name and normalized arguments. Elide the payload only when (a) the tool is explicitly read-only, (b) the current result is byte/content identical, (c) the earlier full payload is provably still visible in the model's active context via a visibility lease/epoch, (d) the result is successful, and (e) the marker is smaller than the payload. After compaction or context migration, invalidate visibility leases and send the full payload again once before renewed elision. Persist token telemetry separately from conversation state.

## Goal
Reduce repeated tool-result tokens without skipping observation, serving stale data, hiding repeated failures, or referencing content no longer present in model context.

## Metrics
- Repeated tool-result bytes/tokens before and after.
- Tokens saved per task/session.
- Elision hit rate and false-elision count.
- Full reinjection count after compaction/context epoch change.
- Tool executions unchanged (freshness preserved).
- Result-quality/regression pass rate.
- Context utilization and compaction frequency.
- Cost/task and latency/task where provider telemetry is available.

## Trigger
After a successful read-only tool execution and before its output is appended to model-visible context; also whenever context is compacted, pruned, migrated, or reset.

## Inputs
Tool name, normalized arguments, read-only annotation, result status, fresh output bytes/text, context epoch/visibility state, configurable minimum payload size, and token estimator.

## Outputs
Either the full fresh payload or a small deterministic identity marker plus telemetry explaining the decision.

## Interpretation
The evidence supports a real token/context inefficiency, not a universal claim that every repeated read is waste. Re-reading can be necessary because external state changes. The safe optimization target is duplicate model payload, not tool execution itself.

## Proposed solution
A reusable content-addressed reuse gate with explicit read-only eligibility, fresh execution, canonical output hashing, context-epoch visibility leases, deterministic markers, metrics, bounded verification, and regression tests covering changed output, errors, side-effecting tools, compaction invalidation, and marker-size economics.