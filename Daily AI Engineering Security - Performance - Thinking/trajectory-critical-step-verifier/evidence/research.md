# Research — Trajectory Critical-Step Verifier

**Topic:** Long-horizon agents can lock onto an early bad assumption yet continue executing and self-report completion  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Long-running coding and tool-using agents can accumulate assumptions, lose constraint/evidence links, continue after the trajectory has effectively become unrecoverable, and then verify against their own mistaken interpretation. Final success/failure alone does not identify where the decisive error entered, so teams spend substantial effort replaying long traces and may accept unsupported completion claims.

## Why it matters now
Recent August 2026 research increasingly focuses on failure localization rather than only end-to-end success. LongRCA Bench (submitted August 15, revised August 21) targets responsible-role and root-cause localization in long-horizon failures. A separate paper published August 20 introduces checkpoint instrumentation and controlled interventions because many failures occur before the capability of interest is even reached. Microsoft Research's AgentRx similarly identifies a critical failure step from execution trajectories using constraints and auditable validation logs. SWE-Marathon reports that current frontier coding agents solve fewer than 30% of ultra-long-horizon tasks and highlights poor self-verification and premature termination among common failures.

## Affected users
Developers using autonomous coding agents, agent-platform builders, engineering teams reviewing multi-hour runs, evaluation teams, and operators of multi-agent workflows.

## Current public evidence
### Observed evidence
1. **LongRCA Bench**, submitted August 15, 2026 and revised August 21, 2026, states that outcome-level evaluation reveals failure but not the responsible role or earliest decisive root-cause step in long-horizon executions. https://arxiv.org/abs/2608.15242
2. **Beyond End-to-End Success: Diagnosing Failures in Long-Horizon Security LLM Agents**, submitted August 20, 2026, instruments tasks with checkpoints, separates failures before/after capability exposure, and uses controlled interventions; results show dominant failure sources can shift across model generations. https://arxiv.org/abs/2608.20563
3. **AgentRx**, Microsoft Research, February 2026, uses manually annotated failed trajectories with critical failure steps and an auditable constraint-validation log to localize failure causes. https://www.microsoft.com/en-us/research/publication/agentrx-diagnosing-ai-agent-failures-from-execution-trajectories/
4. **SWE-Marathon**, June 2026, evaluates ultra-long-horizon software work; reported frontier-agent success below 30%, with poor self-verification, premature termination, and reward-hacking behavior among observed failure modes. https://huggingface.co/papers/2606.07682

### Interpretation
The recurring engineering weakness is trace governance: agents often lack explicit evidence IDs, assumption lifecycle, bounded unverified spans, and an independent completion gate. Self-reflection after many steps is too late when an earlier false premise has already shaped the trajectory.

## Existing approaches
- Final unit/integration tests.
- Outcome-level benchmark success rates.
- Agent self-reflection or self-critique.
- Full trajectory logging for postmortem analysis.
- Human review at the end of a run.
- LLM-as-a-judge scoring.

## Remaining limitations
- Final tests may validate the wrong interpretation of the task.
- Outcome scores do not localize the first decisive failure.
- Self-verification is correlated with the generator's own assumptions.
- Long traces are expensive for humans to inspect manually.
- Unresolved assumptions can silently become durable premises.
- Agents can continue many steps after a useful stop/replan point.
- Completion language may be emitted without linked evidence.

## Root-cause analysis
1. Facts, assumptions, hypotheses, decisions, and evidence are not explicitly separated.
2. Assumptions lack IDs, owners, and resolution status.
3. There is no maximum allowed span without an observable verification checkpoint.
4. Completion claims are not required to cite external or deterministic evidence.
5. The implementing agent is often also the only verifier.
6. Failure recovery starts after final failure instead of at the earliest risk step.

## Improvement opportunity
Use a small, observable trajectory contract: every step records evidence IDs, active assumption IDs, verification status, and progress claim. A deterministic guard flags unsupported completion, unresolved assumptions, and excessive unverified spans. At the first risk step, the workflow pauses for evidence gathering or independent review rather than continuing indefinitely. The system does not request hidden chain-of-thought; it operates only on explicit artifacts and status fields.

## Relevant sources
- LongRCA Bench: https://arxiv.org/abs/2608.15242
- Beyond End-to-End Success: https://arxiv.org/abs/2608.20563
- Microsoft Research AgentRx: https://www.microsoft.com/en-us/research/publication/agentrx-diagnosing-ai-agent-failures-from-execution-trajectories/
- SWE-Marathon: https://huggingface.co/papers/2606.07682
- Verification Horizon paper: https://arxiv.org/abs/2606.26300
