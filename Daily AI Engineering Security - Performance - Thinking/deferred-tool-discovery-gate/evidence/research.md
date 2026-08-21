# Research — Deferred Tool Discovery Gate

## Topic
Deferred tools can be available to an AI agent but remain undiscovered at the exact moment the agent decides a task is impossible or invents a workaround.

## Category
Thinking

## Problem
Large agent environments increasingly defer tool schemas behind discovery mechanisms such as `ToolSearch`. A model can therefore possess a real capability in the environment without seeing that capability in its currently loaded tool list. If it concludes “cannot determine”, asks the user unnecessarily, or routes around a blocked operation before searching the deferred space, the result is a silent decision-quality failure rather than an explicit tool error.

## Why it matters now
On 2026-08-05, Claude Code issue #84312 reported a worked case where a deferred session-information capability was not acquired on the first attempt; after the user pushed back, the agent searched for and loaded the tools and answered from local records. The report also cites a prior case where a missing deferred permission capability led to a destructive-ish workaround that required cleanup. This is especially relevant as MCP/tool rosters grow and clients defer more schemas to control context size.

## Affected users
Developers using Claude Code/Cowork or other agents with deferred tools, teams with many MCP servers/plugins, platform builders implementing searchable tool catalogs, and users relying on agents to exhaust available evidence before asking questions or claiming a limitation.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #84312, opened 2026-08-05 and still open when researched on 2026-08-19, reports that capabilities behind `ToolSearch` were reached less reliably than loaded tools. In the worked case, two deferred session tools could answer the task, but the agent initially asked the user instead. On the next attempt it loaded the tools and answered from local records. Source: https://github.com/anthropics/claude-code/issues/84312
2. Claude Code issue #84189, opened 2026-08-05, reports a related deferred-tool lifecycle failure: after compaction, a previously loaded deferred schema was no longer present and the agent repeatedly reconstructed the wrong call shape, producing seven `InputValidationError` failures in one session. Source: https://github.com/anthropics/claude-code/issues/84189
3. #84312 points to #83756 as a separate acquisition-cost signal: large `ToolSearch` batches can invalidate the prompt prefix/cache, showing that deferred acquisition is not operationally neutral. Source: https://github.com/anthropics/claude-code/issues/83756

### Interpretation
The core engineering problem is a missing **decision-time capability-discovery invariant**. Static instructions such as “check local sources first” can be present and still not cause a discovery action. A capability catalog hidden behind a search step creates an asymmetric branch: declining or improvising is cheap, while discovering costs an extra action and context. The package does not assume this is a model-only defect; it makes the pre-decline decision observable and testable at the harness level.

### Proposed solution
Introduce a deterministic pre-decline gate. Before an agent emits an impossibility/insufficient-information decision or a workaround caused by an unavailable/blocked capability, compare the task against a compact capability registry. If the registry indicates one or more relevant deferred capabilities that have not been searched or explicitly ruled out, block the decline/workaround and require one bounded discovery pass. After discovery, record `available`, `unavailable`, `failed`, or `not-relevant` evidence and continue.

## Existing approaches
- Always-loaded `CLAUDE.md`/rules saying to inspect available tools first.
- Model-driven `ToolSearch` when the agent remembers to invoke it.
- Loading all tool schemas eagerly.
- User correction after the agent incorrectly claims a limitation.

## Remaining limitations
- Rules do not deterministically prove discovery happened.
- Eager loading increases context size and may hurt cache behavior.
- A raw tool catalog can itself be huge; the gate needs a compact intent-to-capability index.
- Discovery can fail or return too many candidates, so retries must be bounded.
- A keyword gate can produce false positives; it should block only the decline/workaround decision, not force unsafe tool execution.

## Root-cause analysis
1. Capability existence and capability visibility are distinct states.
2. Agents often make a terminal decision using only the currently loaded tool set.
3. Deferred-tool state can be lost across compaction or session transitions.
4. Tool discovery has latency/token cost, encouraging shortcuts at the decision boundary.
5. Harnesses usually log tool calls but do not validate that discovery preceded a limitation claim.

## Improvement opportunity
A small registry plus deterministic gate can make the missing check observable without loading every schema. It can be integrated before “cannot”, “need user input”, permission-workaround, or fallback branches. A specialized verifier then reviews only ambiguous matches.

## Goal
Increase the rate at which relevant deferred capabilities are discovered before terminal limitation claims while avoiding broad eager loading.

## Metrics
- eligible decline/workaround decisions preceded by a discovery check;
- deferred capability acquisition rate;
- false limitation claims caught by the gate;
- unnecessary user prompts avoided;
- discovery calls/task;
- false-positive block rate;
- added latency and tokens versus eager-loading baseline;
- repeated schema-validation failures after compaction.

## Trigger
Immediately before a terminal “cannot determine/cannot perform”, user-question due solely to missing capability, permission workaround, or fallback caused by an unavailable tool.

## Inputs
Task text, planned decision class, currently loaded tools, compact deferred capability registry, prior discovery evidence, and optional context/session epoch.

## Outputs
`allow`, `discover`, or `review` plus matched capability IDs and evidence requirements.

## Existing-solution caveat
The public issues are reports, not proof that every deferred-tool system has the same defect. The proposed gate is therefore an instrumentation/control pattern whose value must be measured in the adopting environment.

## Status
**Implemented:** reusable gate, rules, workflow, verifier instructions, hook, tests.

**Measured:** only after an adopter runs a loaded-vs-deferred evaluation or production telemetry.

**Verified:** only when deterministic tests pass and the adopter demonstrates that gated decisions reduce unsupported capability claims without unacceptable false positives.
