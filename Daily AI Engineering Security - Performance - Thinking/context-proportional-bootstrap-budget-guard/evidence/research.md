# Research

## Topic
Context-proportional bootstrap budgeting for AI agents

## Category
Token

## Problem
Fixed-size agent bootstrap prompts can crowd out task context on small/local models because tool schemas, skills, memory and instructions are loaded before the user's work begins.

## Why it matters now
Local and self-hosted models with 4K/8K/16K windows are actively used in agent mode, while agent runtimes keep adding default tools and instructions. The failure happens before normal compaction can help.

## Affected users
Developers using local/small-context models, agent platform builders, teams routing workloads across heterogeneous models, and users paying latency/cost for oversized repeated bootstrap context.

## Current public evidence
### Observed evidence
1. Odysseus issue #4778 (2026-06-23) reports that agent mode sends the same prompt volume to 4K local models as to 128K API models; tool schemas and skill blocks can consume most context. It specifically notes fixed RAG tool counts and compact mode based on endpoint/model type rather than context size. https://github.com/odysseus-dev/odysseus/issues/4778
2. Odysseus issue #2750 (2026-06-05) reports agent system prompts approaching roughly 10K tokens and tracks slimming/modularization for smaller 4K/8K/16K models. https://github.com/odysseus-dev/odysseus/issues/2750
3. OpenClaw issue #92451 (2026-06-12) reports 20+ new default tools/instructions increasing prompt bloat and degrading instruction following on smaller models. https://github.com/openclaw/openclaw/issues/92451
4. GitHub Copilot CLI context-management documentation states that system instructions and tool definitions are always present and consume a fixed portion of the context window, while tool calls/results accumulate. https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management

## Interpretation
The recurring engineering weakness is not merely 'large prompts'; it is the absence of an explicit bootstrap allocation tied to the active model's context capacity and output/tool-result reserve. Later compaction cannot recover first-turn capacity already consumed by unconditional bootstrap material.

## Existing approaches
- conversation compaction/summarization near window limits
- large tool output spill-to-file
- compact tool hints
- reducing default tools manually
- routing small models to simpler agent modes

## Remaining limitations
- many controls trigger after context is already crowded
- compact modes may be endpoint-based rather than context-size-based
- static tool/skill counts ignore model capacity
- ad hoc pruning lacks a measurable correctness floor
- required security/policy context can be accidentally removed when optimizing manually

## Root-cause analysis
1. Bootstrap components are assembled independently without a shared token budget.
2. Model context size is discovered too late or treated as metadata rather than a hard resource limit.
3. Required and optional context are not explicitly classified.
4. Output/tool-result headroom is not reserved before loading capabilities.
5. Tool/skill selection optimizes availability rather than marginal task relevance per token.

## Improvement opportunity
Introduce a model-aware pre-turn allocator that reserves task/output headroom, caps bootstrap as a percentage of context, preserves mandatory constraints, and evicts optional components by priority and token contribution before the first model call.

## Proposed solution
A deterministic manifest analyzer plus policy, rules, workflow and reviewer contract. It does not decide semantic relevance itself; it enforces measurable token ceilings around whatever selector the host uses.

## Metrics
Bootstrap tokens, bootstrap ratio, remaining task budget, optional tokens evicted, tools/skills initially loaded, context overflow frequency, premature compaction frequency, task-quality regression rate.

## Trigger
Before first model invocation and whenever model/context-window/capability manifest changes.

## Inputs
Context window size, component manifest with measured/estimated token counts, budget policy.

## Outputs
Pass/fail decision, budget report, required retention status, ordered optional eviction candidates.

## Relevant sources
- https://github.com/odysseus-dev/odysseus/issues/4778
- https://github.com/odysseus-dev/odysseus/issues/2750
- https://github.com/openclaw/openclaw/issues/92451
- https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management
