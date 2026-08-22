# Research — Agent Tool-Loop Progress Guard

## Problem
Tool-using coding/research agents can repeatedly execute identical or near-duplicate tool calls, continue repository exploration after enough evidence has been collected, or retry a failing wrapper pattern without changing strategy. The result is wasted model/tool calls, higher latency, increased token/context usage, unnecessary load on external systems, and eventual exhaustion of iteration caps.

## Category
Performance

## Why it matters now
Recent 2026 public issues show the same failure mode across several agent runtimes rather than one isolated implementation:

- Anthropic Claude Code issue #59318 reports the same `grep`-style command being invoked 30+ times during exploratory research before termination.
- Google ADK issue #6566, opened 2026-08-03, reports an infinite loop where streaming multi-agent handoff causes tools to be re-called with slightly different arguments.
- Hermes Agent issue #73388, opened 2026-07-28, reports repeated `tool_search/tool_describe/tool_call` retries after explicit rejection instead of switching to direct tool invocation.
- Hermes issue #49075 reports a guardrail coverage gap where read-only tools were missing from idempotent-loop detection.
- ZeroClaw issue #7143 reports near-duplicate repository discovery commands until `max_tool_iterations` is exhausted.

A 2026 paper on verified tool calls also shows that retries under non-atomic failure can create duplicate actions and unnecessary tool executions, supporting the need for host-side verification and retry semantics rather than model-only behavior.

## Observed evidence
### Signal 1 — repeated successful exploration calls
Claude Code #59318 documents open-ended exploration that continues after sufficient information exists, eventually repeating the same command dozens of times.

### Signal 2 — framework-level looping bug
Google ADK #6566 documents an infinite tool-call loop in multi-agent streaming handoff, where calls recur with slightly different arguments.

### Signal 3 — repeated rejected strategy
Hermes #73388 documents an agent repeatedly attempting an invalid wrapped tool path despite receiving a clear rejection, eventually triggering loop guardrails.

### Signal 4 — incomplete guardrail classification
Hermes #49075 documents that loop detection can fail when some read-only/idempotent tools are omitted from guardrail classification.

### Signal 5 — near-duplicate discovery loops
ZeroClaw #7143 documents repeated variations of `git status` + `find` instead of progressing to edits, ending at the configured tool iteration cap.

## Existing approaches
1. Global `max_tool_iterations` hard caps.
2. Exact duplicate-call detection.
3. Failure-count based retry limits.
4. Prompt instructions telling the model not to repeat itself.
5. Warning-first loop guardrails.
6. Manual operator intervention/reset.

## Observed limitations
- A global cap stops runaway work but does not distinguish productive exploration from non-progress.
- Exact matching misses semantically equivalent calls with reordered flags, alternate whitespace, or slightly changed search terms.
- Failure counters miss repeated *successful* calls returning no new information.
- Prompt-only rules are probabilistic and model-dependent.
- A warning may not alter strategy if the model immediately repeats a different but equivalent call.
- Tool classification tables can become incomplete as new tools are added.
- Hard stopping without a recovery handoff can lose useful work already collected.

## Root-cause hypotheses
1. Agent runtimes often track call count but not **information gain** or progress.
2. Tool-call identity is compared syntactically rather than canonically/semantically.
3. Retry state is local to one tool/error instead of a broader strategy fingerprint.
4. The model is allowed to decide whether another exploratory call is useful without deterministic host-side checks.
5. Stop conditions are global rather than scoped to tool, strategy, phase, or evidence coverage.
6. The runtime may not distinguish read-only/idempotent tools from side-effecting tools for safe suppression/replay behavior.

## Improvement target
Create a reusable host-side progress guard that:

- canonicalizes tool calls before comparison;
- fingerprints tool name + normalized arguments + output digest;
- tracks exact repeats and near-duplicate strategy families;
- measures simple information-gain proxies from output novelty;
- maintains per-tool and per-phase budgets;
- warns first, then requires strategy change, then blocks repeated calls;
- never auto-replays side-effecting tools;
- provides a recovery packet summarizing evidence collected and why the loop stopped;
- emits measurable metrics for calls avoided, latency avoided, token/context savings, and false-positive blocks.

## Success metrics
- Reduce duplicate/near-duplicate exploratory tool calls by at least 60% on synthetic loop fixtures.
- No side-effecting tool is automatically replayed by the guard.
- Every blocked call produces a deterministic reason and recovery action.
- False-positive block rate stays below 5% on curated productive exploration traces.
- Median tool-call count and wall-clock time improve on loop-prone benchmark traces without reducing task completion rate.

## Sources
- Anthropic Claude Code issue #59318, “Agent repeatedly calls the same tool in an infinite loop during exploratory research tasks”, opened 2026-05-15: https://github.com/anthropics/claude-code/issues/59318
- Google ADK Python issue #6566, “StreamingResponseAggregator causes infinite tool-call loop with transfer_to_agent + streaming”, opened 2026-08-03: https://github.com/google/adk-python/issues/6566
- Hermes Agent issue #73388, repeated retries through tool_search/tool_describe/tool_call, opened 2026-07-28: https://github.com/NousResearch/hermes-agent/issues/73388
- Hermes Agent issue #49075, missing idempotent-tool classification in loop guardrail: https://github.com/NousResearch/hermes-agent/issues/49075
- ZeroClaw issue #7143, near-duplicate shell discovery until max_tool_iterations: https://github.com/zeroclaw-labs/zeroclaw/issues/7143
- Mansoor et al., “Verified Tool Calls Improve LLM Agent Reliability Under Non-Atomic Failures”, arXiv:2608.02645, 2026: https://arxiv.org/abs/2608.02645

## Evidence / interpretation / proposed solution boundary
- **Observed evidence:** the cited sources report repeated or redundant tool execution and guardrail/retry gaps.
- **Interpretation:** a useful generalized control is progress-aware host-side loop detection rather than only global iteration caps.
- **Proposed engineering solution:** the canonicalization, novelty scoring, phase budgets, warning/block policy, and recovery packet in this package are a reusable design; they are not claimed to be an official standard of the cited projects.