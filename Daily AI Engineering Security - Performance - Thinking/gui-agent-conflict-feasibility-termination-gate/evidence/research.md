# Research

## Topic
GUI Agent Conflict Feasibility Termination Gate

## Category
Thinking

## Problem
GUI/computer-use agents often continue executing when the user instruction is internally contradictory, conflicts with observable interface state, or is currently infeasible. Strong task-execution capability can amplify this failure because the agent optimizes for acting rather than first proving that action is feasible.

## Why it matters now
A paper submitted 2026-09-03 introduces CONFLICTGUI and reports severe execution-biased overcompliance across five widely used GUI agents. Its inference-time CONFLICTGUARD improves conflict-task success while preserving normal-task performance. Ruflo issue #3191, opened 2026-09-05, independently maps the finding to an orchestration-level feasibility gate and explicitly notes that reproduction is still pending. Earlier 2026 BLIND-ACT work evaluated nine frontier models and reported high blind goal-directedness rates, including contradictory/infeasible goals, showing that the problem predates this week's benchmark and is not tied to one agent.

## Affected users
Developers and teams building browser, desktop, mobile, robotic-interface, and multimodal GUI agents; users delegating consequential tasks; orchestration platforms coordinating computer-use subagents.

## Current public evidence
### Observed evidence
1. Huang et al., arXiv:2609.03438, 2026-09-03: CONFLICTGUI covers instruction-internal and instruction-GUI conflicts; tested agents often continue acting under conflicts; CONFLICTGUARD improves conflict-aware termination across five agents.
2. Ruflo issue #3191, 2026-09-05: proposes an orchestration-level conflict-aware feasibility gate based on the new result, while correctly marking RuV reproduction as pending.
3. ICLR 2026 BLIND-ACT work, "Just Do It!? Computer-Use Agents Exhibit Blind Goal-Directedness": across nine frontier models, reports high average blind goal-directedness and identifies contradictory/infeasible goals, ambiguity, and execution-first bias as recurring failure modes.

### Interpretation
The recurring engineering weakness is a missing explicit state transition between understanding a task and authorizing action. A plan can sound coherent while feasibility evidence is incomplete. The runtime should require observable facts, unresolved conflicts, and stop/review criteria to be represented before consequential actions are permitted.

## Existing approaches
- Prompt agents to verify state before acting.
- Use model confidence/uncertainty and human approval.
- Add inference-time feasibility checks such as CONFLICTGUARD.
- Restrict dangerous actions behind permission prompts.

## Remaining limitations
- Prompt-only instructions can be skipped during long trajectories.
- Confidence is not equivalent to contradiction detection.
- Human approval can be asked too late, after the agent has already performed reversible but harmful setup steps.
- A feasibility verifier can itself hallucinate unless its decision is tied to explicit observable evidence.
- Research benchmarks do not automatically provide an integration contract for arbitrary orchestration frameworks.

## Root-cause analysis
1. Action generation and feasibility assessment are coupled in one model step.
2. Runtimes do not persist unresolved contradictions as blocking state.
3. Preconditions are expressed narratively rather than as machine-checkable claims.
4. Stop conditions are weak or absent.
5. Verification focuses on task completion, not correct abstention/termination.

## Improvement opportunity
Introduce a reusable pre-action gate with explicit Facts, Assumptions, Conflicts, Preconditions, Evidence, Action Risk and Decision fields. Require `ACT` only when no blocking conflict exists and required evidence is present; otherwise emit `STOP` or `REVIEW`. Use deterministic validation for structure and bounded retries for evidence refresh, with separate verification of correct termination behavior.

## Relevant sources
- CONFLICTGUI / CONFLICTGUARD paper: https://arxiv.org/abs/2609.03438
- Ruflo issue #3191: https://github.com/ruvnet/ruflo/issues/3191
- ICLR 2026 GUI Agents listing for BLIND-ACT / "Just Do It!? Computer-Use Agents Exhibit Blind Goal-Directedness": https://paperlist.ai/en/conferences/iclr/2026/topics/gui-agents
