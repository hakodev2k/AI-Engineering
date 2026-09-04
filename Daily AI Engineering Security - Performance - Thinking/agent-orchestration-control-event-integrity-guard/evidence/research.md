# Research — Agent Orchestration Control-Event Integrity Guard

## Topic
Preserve causal and semantic integrity when agent runtimes translate UI/meta/status/subagent events into model-visible context and tool-routing decisions.

## Category
Thinking

## Problem
Agent orchestration depends on non-user control events: subagent completion, wait/status requests, interruption, auto-continuation, UI metadata, lifecycle notifications and scheduler signals. When these events are represented as ordinary natural-language turns or routed through the wrong tool surface, the model can lose causal state, repeat completed work, invent explanations, enter tool-selection loops, or act on a synthetic message as if it were a real user instruction.

## Why it matters now
Recent 2026 issue reports show that failures are occurring in production coding-agent clients, especially around visible subagents and desktop/headless orchestration. These are not hidden-reasoning defects; they are observable control-plane representation and routing failures.

## Affected users
Coding-agent users, agent runtime/UI developers, multi-agent platform builders, CI/headless automation owners, and teams depending on long-running delegated work.

## Current public evidence
### Observed evidence
1. **Anthropic Claude Code issue #37040.** The Desktop client generated synthetic `No response requested` content during `isMeta` auto-continuation. Reports described completed agent results being blocked from the model, user interruption severing awareness of an in-flight tool call, redundant agent launches, and confabulated explanations. The same workflows reportedly behaved normally in CLI, localizing the issue to Desktop control-message handling. Source: https://github.com/anthropics/claude-code/issues/37040
2. **OpenAI Codex issue #38132, opened 2026-08-12.** During long-running tasks with visible subagents, agent-status intents intended for collaboration lifecycle tools were routed to PowerShell, producing placeholder commands such as `Write-Output 'list_agents'` and repeated attempts instead of invoking `collaboration.list_agents` / `wait_agent`. The result was a tool-selection loop. Source: https://github.com/openai/codex/issues/38132
3. **Anthropic Claude Code issue #69525.** A user reported context/tooling corruption including fabricated successful file operations, instruction-like text appended to tool output, and user turns they said they never wrote; permission prompts prevented attempted git state changes. This is a broader signal that provenance of user/control/tool text is security- and correctness-relevant. Source: https://github.com/anthropics/claude-code/issues/69525

## Existing approaches
- Encode UI/runtime events as messages in the conversation transcript.
- Let the model infer whether natural-language content is user intent, metadata, or a status request.
- Route actions using model tool selection from the full tool inventory.
- Use auto-continuation messages such as “continue” after asynchronous work.
- Depend on tool-call/result IDs for individual calls while leaving higher-level lifecycle/control events loosely typed.

## Remaining limitations
Message role alone is insufficient when clients synthesize content. A text string can be semantically a control signal but structurally resemble a user instruction. Tool schemas do not guarantee that an agent-status intent selects a collaboration tool instead of shell. A continuation message without a causal reference can arrive after interruption or completion and obscure which operation it belongs to. Existing lifecycle tracking can be correct in the backend while the model-visible event stream is semantically corrupted.

## Root-cause analysis
- Control-plane events are flattened into natural-language transcript content.
- Synthetic events lack explicit provenance and `synthetic=true` markers.
- Continuations lack causal references to the exact run/tool/subagent lifecycle transition.
- Tool-routing policy does not constrain control intents to capability-compatible tool classes.
- Model-visible context can contain control text that looks like user-authored instructions.
- No deterministic invariant checks the event sequence before model re-entry.

## Interpretation
The reusable problem is an orchestration event-integrity boundary. Correct reasoning requires facts about *who/what emitted an event*, *what operation it belongs to*, and *which tool classes may legally handle it*. Improving hidden chain-of-thought is neither required nor desirable; the fix is typed, observable state.

## Improvement opportunity
Introduce a typed control-event envelope with provenance, causal IDs, event kind, lifecycle state and allowed routing class. Synthetic control events remain metadata, never user intent. Before model re-entry, validate sequence invariants: causal target exists, terminal events cannot revert to running, completion carries a result reference, interruptions bind to the active run, and status intents cannot route through shell placeholders. Emit a compact model-facing summary only after validation.

## Goal
Reduce control-plane-induced loops, duplicated work, lost subagent results and unsupported conclusions by making orchestration facts explicit and mechanically verifiable.

## Metrics
- invalid control events / 1,000 events
- synthetic events misclassified as user turns
- control intents routed to wrong tool class
- duplicate subagent launches after a completion result
- status/wait loop count
- lost-result incidents
- verified lifecycle transitions / total transitions
- rework caused by control-state mismatch

## Trigger
Any UI/runtime change affecting auto-continuation, subagent lifecycle, wait/status routing, interruption/resume, transcript synthesis, or control-event serialization.

## Inputs
Event stream, active run/subagent registry, tool capability map, transcript roles/provenance, expected lifecycle state, routing policy.

## Outputs
Validated event stream, blocked-event report, compact model-facing control summary, routing decision, verification status.

## Proposed solution
See the package schema/policy, validation script, rules, skill, workflow, hook, tests, and independent verifier.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/37040
- https://github.com/openai/codex/issues/38132
- https://github.com/anthropics/claude-code/issues/69525
