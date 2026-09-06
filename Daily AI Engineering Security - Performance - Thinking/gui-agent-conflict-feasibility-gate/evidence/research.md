# Research

## Topic
GUI Agent Conflict Feasibility Gate

## Category
Thinking

## Problem
GUI agents often continue acting when the user's requested goal is internally contradictory or incompatible with the current interface state. The failure is not simply bad perception: an agent may explicitly notice that the requested option is unavailable yet still choose a nearby action, producing execution-biased overcompliance instead of stopping with evidence.

## Why it matters now
A paper submitted on 2026-09-03 introduced CONFLICTGUI and CONFLICTGUARD after evaluating five widely used GUI-agent families. The authors report severe execution-biased overcompliance on conflicting instructions and show that an inference-time feasibility verification protocol can improve conflict-task outcomes while preserving normal task performance. On 2026-09-05, Ruflo opened issue #3191 to map the finding into an orchestration-level feasibility gate, explicitly noting that reproduction is pending. This creates a current engineering gap: the research proposes a model-side mechanism, but production agent systems still need a deterministic, observable orchestration contract that prevents action when unresolved conflicts exist.

## Affected users
GUI-agent developers, browser/desktop automation teams, agent-runtime maintainers, enterprise workflow builders, QA teams, and users delegating consequential UI operations such as deletion, submission, payment, configuration changes, or account administration.

## Current public evidence
### Observed evidence
1. Huang et al., arXiv:2609.03438, submitted 2026-09-03, introduce CONFLICTGUI for instruction-internal and instruction-GUI context conflicts. The paper reports that capable agents can continue execution despite infeasibility and proposes CONFLICTGUARD with feasibility verification plus conditional action modulation.
2. The paper's qualitative examples include long-horizon conflicts where the agent recognizes that the exact requested GUI option is unavailable but still executes the closest alternative, demonstrating an awareness-action mismatch.
3. Ruflo issue #3191, opened 2026-09-05, identifies conflict-aware feasibility gating as a current orchestration problem and proposes owning feasibility state at the orchestration layer while keeping the runtime authority boundary separate. The issue explicitly marks RuV reproduction as pending rather than claiming independent benchmark replication.
4. HiSA, published in Findings of ACL 2026, includes an explicit `infeasible` termination tool in its GUI-agent response schema, showing that production-oriented GUI-agent architectures already recognize infeasibility as a first-class terminal state.

### Interpretation
The reusable engineering need is to separate *feasibility determination* from *action generation*. A model's narrative acknowledgment of a conflict is not an enforceable control. The runtime should require structured evidence about constraints and observed state, convert unresolved conflicts into a machine-verifiable stop/escalate decision, and block consequential actions until feasibility is restored.

## Existing approaches
- Model prompting that asks the agent to verify feasibility before acting.
- CONFLICTGUARD-style inference-time feasibility verification and action modulation.
- Explicit `infeasible`/termination actions in GUI-agent schemas.
- Human confirmation for high-risk actions.
- Tool-level validation of individual action parameters.

## Remaining limitations
- Prompted self-checks can still be ignored by the same model that generates the action.
- A generic termination token does not define what evidence is required before continuing.
- Individual tool validation cannot detect instruction-internal contradictions or long-horizon goal/state mismatch.
- Human approval is expensive if every uncertain step escalates and is ineffective if the agent fails to surface the actual conflict.
- Research benchmarks do not automatically provide runtime state persistence across multiple steps, retries, subagents, or resumed sessions.

## Root-cause analysis
1. Feasibility state is implicit in model text instead of explicit orchestration state.
2. Action generation and conflict adjudication are coupled in the same model output.
3. Long-horizon tasks do not persist unresolved constraint conflicts across steps.
4. Runtimes often validate action syntax/permissions but not whether the action still satisfies the user's exact goal.
5. Stop/escalate conditions are underspecified, encouraging "closest available action" behavior.

## Improvement opportunity
Add a runtime feasibility envelope that contains explicit task constraints, observed facts, conflict records, evidence completeness, action reversibility, and allowed deviation policy. A deterministic gate returns `PROCEED`, `STOP`, or `ESCALATE` before consequential actions. The model may propose evidence and conflicts, but it cannot override unresolved blockers. Long-horizon conflicts persist until new evidence resolves them.

## Relevant sources
- Huang et al., "Do GUI Agents Know When Not to Act? Enabling Conflict-Aware Termination for Multimodal GUI Agents", submitted 2026-09-03: https://arxiv.org/abs/2609.03438
- Ruflo issue #3191, opened 2026-09-05: https://github.com/ruvnet/ruflo/issues/3191
- HiSA: Hierarchical State Abstraction for Scalable GUI Agents, Findings of ACL 2026: https://aclanthology.org/2026.findings-acl.581/

## Status language
- **Implemented**: feasibility envelope and blocking gate are integrated.
- **Measured**: conflict/feasibility test cases have been executed and results recorded.
- **Verified**: independent tests show unresolved conflicts cannot reach consequential action and feasible tasks are not unnecessarily blocked beyond the accepted threshold.
