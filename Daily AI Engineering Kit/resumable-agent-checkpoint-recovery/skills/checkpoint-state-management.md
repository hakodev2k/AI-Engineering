# Skill: Checkpoint State Management

## Purpose
Persist enough verifiable execution state that a long-running engineering task can resume safely without relying on conversational memory.

## When to use
Use before and during multi-stage tasks, after material repository changes, after external tool calls whose result matters, before approval boundaries, and before ending a session that may need to resume.

## Inputs
- Task objective and acceptance criteria.
- Current repository/environment baseline.
- Planned stages.
- Current checkpoint, if one exists.
- Tool results, failures, changed files, and approvals.

## Preconditions
- A writable checkpoint location exists.
- The agent can determine a baseline Git ref when operating in a repository.
- Dangerous actions are identifiable before execution.

## Process
1. Define a stable `task_id` and concise objective.
2. Record baseline evidence: repository, branch, commit, environment, and relevant external identifiers.
3. Decompose work into ordered stages with explicit completion evidence.
4. Set `current_stage` and `next_action` before executing.
5. Before a dangerous action, record `pending_approval` and stop until approval is present.
6. After a material action, append an event containing timestamp, stage, action, result, evidence, and affected files/resources.
7. Record failures separately from successful events; never overwrite failure history.
8. Update retry counters by failure fingerprint rather than globally.
9. Persist external side effects with identifiers sufficient to check whether they already occurred.
10. Update `next_action` to exactly one executable next step.
11. Validate the checkpoint using `scripts/validate-checkpoint.py`.
12. Only then proceed to another stage or end the session.

## Tools
- Repository/file reading.
- Git status/diff/log.
- Local commands needed to validate state.
- Checkpoint validation script.

## Constraints
- Do not store secrets, tokens, credentials, or sensitive raw payloads.
- Do not claim an external action completed without durable evidence.
- Do not compress away unresolved failures or approvals.
- Do not mark status `verified` from implementation evidence alone.

## Expected output
A schema-valid checkpoint containing objective, baseline, stage history, events, failures, approvals, changed resources, next action, and verification state.

## Verification
- Run the checkpoint validator.
- Confirm the current stage exists in the plan.
- Confirm every completed stage has evidence.
- Confirm pending approvals block relevant actions.
- Confirm `verified` includes verification evidence.

## Failure handling
If checkpoint writing fails, stop before additional material actions. If validation fails, repair only fields supported by evidence; otherwise mark the task blocked.

## Stop conditions
Stop when checkpoint state cannot be reconciled with observable repository/environment state, when a required approval is missing, or when a non-idempotent action has an unknown prior outcome.
