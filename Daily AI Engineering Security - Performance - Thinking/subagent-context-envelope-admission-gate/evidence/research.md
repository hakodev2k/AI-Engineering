# Research — Subagent Context Envelope Admission Gate

## Topic
Subagent Context Envelope Admission Gate

## Category
Token

## Problem
Subagents can be dispatched with a fixed and inherited context envelope that is already too large for the model that will actually serve the subagent. The failure may happen before useful work begins, or later when compaction thresholds are derived from a different model's context window.

## Why it matters now
Two current Claude Code bug reports independently show context-fit failures in subagent orchestration. Issue #84947, opened 2026-08-07 and still open as of 2026-08-20, reports a built-in subagent whose system prompt and tool definitions consume roughly 214k tokens against a 200k model limit before meaningful user input. Issue #83355, opened 2026-08-02 and updated 2026-08-20, reports mixed-model subagents using the coordinator model's context-window assumptions for auto-compaction, causing smaller-window subagents to grow until the provider rejects the request.

## Affected users
Developers using coding agents, mixed-model agent orchestration, custom subagents with large tool schemas, agent-platform teams, and users paying for repeated failed or restarted runs.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #84947 documents immediate subagent failure caused by fixed system/tool/attachment overhead exceeding the selected model's context limit. The reporter measured roughly 214.3k fixed tokens against a 200k limit and reproduced it with both large and tiny user prompts.
   - https://github.com/anthropics/claude-code/issues/84947
2. Anthropic Claude Code issue #83355 documents a different failure mode: a subagent pinned to a smaller-context model uses the coordinator session's larger context assumptions for auto-compaction, so compaction does not occur before the subagent's actual hard ceiling. The report includes repeated measurements and a process-global workaround with important limitations.
   - https://github.com/anthropics/claude-code/issues/83355
3. Anthropic's Claude Code subagent documentation allows subagents to specify different models and tool sets, which makes per-subagent context sizing and tool-schema overhead an orchestration concern rather than a single-session concern.
   - https://docs.anthropic.com/en/docs/claude-code/sub-agents

### Interpretation
These reports do not prove every subagent framework has the same bug. They demonstrate a recurring engineering class: dispatch decisions can be made without validating the complete request envelope against the context limit of the model that will actually execute the subagent. Fixed prompt/tool overhead and inherited context can therefore make a task impossible before the first useful turn, while mixed-model compaction can use the wrong ceiling.

## Existing approaches
- Rely on provider errors when the request exceeds the context window.
- Reduce the caller prompt after a failure.
- Globally lower compaction thresholds.
- Use a larger-context model.
- Manually remove tools or attached context.
- Let the agent framework compact automatically.

## Remaining limitations
Provider errors occur after dispatch and may waste a model/tool turn. Caller-side prompt trimming cannot fix an oversized fixed agent definition. Global compaction limits can unnecessarily constrain larger models. Automatic compaction may use session-level rather than selected-subagent limits. Blindly removing tools or context can damage correctness.

## Root-cause analysis
- Fixed system instructions, tool schemas, attachments, inherited history, user input, and output reserve are often budgeted separately rather than as one envelope.
- The context limit can be resolved from the coordinator/session model instead of the selected subagent model.
- Dispatchers frequently lack a deterministic admission check before starting a subagent.
- Tool sets may be attached eagerly even when only a subset is required.
- Context-reduction decisions are not always ordered by semantic criticality.

## Improvement opportunity
Add a deterministic pre-dispatch admission gate that calculates the complete subagent context envelope against the selected model's declared context limit and a mandatory safety reserve. It should allow dispatch only when the envelope fits, otherwise produce ordered non-destructive remediation: remove optional duplicate context, lazily load optional tools, route to an approved larger-context model, or block with an explicit deficit. Required correctness/security context must never be silently dropped.

## Goal
Prevent context-overflow subagent dispatches and surface actionable sizing evidence before model execution.

## Metrics
- Pre-dispatch overflow detection rate on known failing fixtures: 100%.
- False allow rate for envelopes larger than effective budget: 0%.
- Context-fit failures after admitted dispatch: target 0 in controlled tests.
- Tokens avoided from rejected-before-dispatch requests.
- Percentage of admitted tasks retaining all required context: 100%.
- Optional-context reduction amount and model-reroute rate.

## Trigger
Before every subagent dispatch and whenever its selected model, tool set, inherited context, system instructions, attachments, or output reserve changes.

## Inputs
Selected model identifier, model context limit, fixed system tokens, tool-schema tokens, inherited-context tokens, attachment tokens, user-input tokens, expected output reserve, required-context tokens, and optional removable context segments.

## Outputs
`allow`, `reduce_optional`, `reroute`, or `block` decision; effective budget; total envelope; deficit/headroom; preserved required-context status; and ordered remediation evidence.

## Proposed solution
A reusable context-envelope policy, deterministic Python admission script, pre-dispatch hook, bounded workflow, and independent context-budget reviewer. The package measures rather than guesses token components; it does not request hidden reasoning and does not remove required context merely to lower cost.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84947
- https://github.com/anthropics/claude-code/issues/83355
- https://docs.anthropic.com/en/docs/claude-code/sub-agents
