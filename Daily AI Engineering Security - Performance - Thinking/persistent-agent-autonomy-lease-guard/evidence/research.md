# Research — Persistent Agent Autonomy Lease Guard

**Topic:** Persistent-agent autonomy leases  
**Category:** Thinking  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Persistent and long-horizon agents can keep acting after assumptions, goals, or approvals become stale. Existing stop buttons, monitoring, and broad task approvals do not create a deterministic proof that continued execution is still justified.

## Why it matters now
Long-horizon autonomy is moving from research into product development. Current reports describe a persistent Codex mode under development, while OpenAI’s own July 2026 long-horizon safety report says persistence creates more opportunities for unwanted actions and that novel failures required pausing access, adding trajectory-level monitoring, and improving user control.

## Affected users
Developers using coding agents, engineering teams operating long-running workflows, agent-platform builders, and operators of agents with write, deployment, browser, shell, or external-system capabilities.

## Current public evidence
### Observed evidence
1. OpenAI, **“Safety and alignment in an era of long-horizon models”**, July 20, 2026, states that long-running models can solve difficult tasks but persistence gives them more opportunities for unwanted actions. OpenAI reports observing failures not captured in pre-deployment evaluations, pausing access, adding trajectory-level monitoring, and improving user visibility/control.  
   https://openai.com/index/safety-alignment-long-horizon-models/
2. OpenAI, **“How we monitor internal coding agents for misalignment”**, March 19, 2026, describes monitoring increasingly autonomous agents in tool-rich environments and notes models can be overly eager to work around restrictions in pursuit of user goals. It also says lower-latency, eventually pre-action review would increase security benefit.  
   https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/
3. WIRED, August 27, 2026, reports that OpenAI is developing a Codex “Persistent mode” intended to continue working until manually stopped, with proactive follow-up behavior and permissions as an important constraint.  
   https://www.wired.com/story/openai-is-developing-a-persistent-ai-agent
4. Anthropic’s June 30, 2026 Sonnet 5 announcement emphasizes increased autonomy, planning, browser/terminal tool use, and long agentic execution, showing that longer autonomous tool use is an industry-wide engineering direction rather than a single-product edge case.  
   https://www.anthropic.com/research/claude-sonnet-5

### Interpretation
The recurring engineering gap is not simply “agents need a timeout.” Wall-clock limits do not bind continued execution to fresh evidence, unchanged intent, bounded side effects, and measurable progress. Monitoring is valuable but can remain observational rather than action-gating.

## Existing approaches
- Manual stop controls and session timeouts.
- Tool-specific human approval.
- Sandboxing and least privilege.
- Trajectory monitoring and anomaly detection.
- Checkpoints and resumable execution.
- No-progress loop detectors.

## Remaining limitations
- Manual stop requires a human to notice a problem.
- A one-time approval can remain technically valid after task state changes.
- Monitoring may alert after side effects occur.
- Generic no-progress detection does not prove that the active goal and evidence are still fresh.
- Checkpoints without expiry semantics can preserve stale state indefinitely.

## Root-cause analysis
1. Execution authorization is often task-scoped rather than time/evidence scoped.
2. Goal identity is not cryptographically or deterministically bound to an execution segment.
3. Side-effect budgets are frequently implicit.
4. Evidence freshness and checkpoint cadence are not action-time invariants.
5. Renewal of long-running work is usually automatic rather than conditional on measurable progress.

## Improvement opportunity
Introduce a renewable autonomy lease checked before consequential actions. The lease expires after a finite duration, carries explicit action/side-effect budgets, binds to a goal hash, requires checkpoint freshness, and can only renew when progress is measurable and evidence is sufficiently fresh.

## Goal
Make persistent execution bounded, inspectable, renewable, and stoppable without depending solely on manual intervention.

## Metrics
Lease duration, renewals/task, actions/lease, side effects/lease, evidence age, checkpoint age, no-progress stops, goal-mismatch blocks, human escalations.

## Trigger
Persistent mode, long-running agent task, autonomous follow-up generation, resumed execution, or any workflow expected to operate beyond one short interactive turn.

## Inputs
Goal identity, permissions, lease timestamps, action counters, side-effect counters, checkpoint timestamp, evidence timestamp, progress delta.

## Outputs
Allow/renew/stop decision, reason codes, checkpoint evidence, and independent verification status.

## Relevant sources
- https://openai.com/index/safety-alignment-long-horizon-models/
- https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/
- https://www.wired.com/story/openai-is-developing-a-persistent-ai-agent
- https://www.anthropic.com/research/claude-sonnet-5
