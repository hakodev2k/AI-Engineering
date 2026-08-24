# Agent Evaluation

## Purpose
Evaluate AI agents across planning, tool use, state management, recovery, task completion, and operational safety rather than judging only their final text.

## When to use
Use for tool-using agents, coding agents, browser agents, workflow agents, or any system that takes actions over multiple steps.

## Inputs
- Task definitions and success criteria
- Agent traces and tool calls
- Environment state
- Allowed actions and permissions
- Cost and latency budgets

## Context to inspect
Inspect system prompts, tool schemas, retry logic, memory/state handling, permissions, termination conditions, and environment determinism.

## Core knowledge
Agent evaluation is trajectory evaluation. Final success can conceal unsafe or wasteful paths, while failed tasks can reveal recoverable planning defects. Key dimensions include task success, action validity, tool selection, efficiency, recoverability, and policy compliance.

## Procedure
1. Define task-level success independent of the agent’s own claims.
2. Build representative tasks with deterministic environment setup where possible.
3. Capture full action trajectories and tool responses.
4. Score final task success separately from trajectory quality.
5. Check invalid actions, unnecessary steps, loops, retries, and permission violations.
6. Evaluate recovery from tool errors and partial failure.
7. Measure latency, token usage, external calls, and monetary cost.
8. Test termination behavior on impossible or already-completed tasks.
9. Add adversarial tasks that tempt unsafe or irrelevant actions.
10. Compare versions using identical environment snapshots or controlled replay.

## Decision points
Use exact task-state checks when outcomes are machine-verifiable; use human or judge review for semantic completion. Penalize unsafe success more heavily than safe failure when actions have side effects.

## Common failure patterns
- Scoring only final response quality
- Allowing the agent to define its own success
- Ignoring loops and redundant tool use
- Non-reproducible external environments
- Missing permission-boundary tests

## Verification
Verify task state directly, replay sampled traces, confirm action logs are complete, and ensure known looping or unsafe agent versions fail the suite.

## Expected output
A trajectory-aware agent evaluation with task success, efficiency, recovery, tool-use, safety, and cost metrics.

## Stop conditions
Stop when environment state cannot be controlled or observed, side-effect permissions are unsafe, or success criteria cannot be independently verified.