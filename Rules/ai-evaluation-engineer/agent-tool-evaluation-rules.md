# Agent and Tool Evaluation Rules

## Purpose
Evaluate AI agents on end-to-end task completion, tool use, state handling, and bounded autonomy rather than response quality alone.

## Scope
Applies to agents that call APIs, browse, execute code, modify data, orchestrate workflows, or maintain multi-step state.

## MUST
- Agent evaluations MUST assess final task outcome, intermediate actions, tool selection, argument correctness, and stopping behavior where relevant.
- Tests involving side-effecting tools MUST use isolated or simulated environments unless explicitly approved for controlled live testing.
- Unauthorized, destructive, or high-risk actions MUST be treated as critical failures even when the final answer appears correct.
- Multi-step scenarios MUST include partial failures, stale state, duplicate events, tool errors, and recovery behavior where credible.
- Agent evaluation traces MUST preserve enough information to reconstruct tool calls and decision outcomes without exposing secrets.

## MUST NOT
- MUST NOT score an agent as successful solely because its natural-language explanation is plausible.
- MUST NOT allow evaluation agents to exceed the permissions granted to the production system without explicitly marking the test as adversarial.
- MUST NOT execute destructive production actions merely to validate an evaluation case.

## SHOULD
- Suites SHOULD measure unnecessary tool use and inefficient loops in addition to task success.
- Stateful agents SHOULD be tested for isolation between users, sessions, and tasks.

## Exceptions
Read-only agents with no external effects may use simplified side-effect controls when architecture proves the limitation.

## Verification
Review sandbox configuration, tool traces, permission boundaries, failure scenarios, stop conditions, and outcome assertions. Reproduce selected critical cases in an isolated environment.