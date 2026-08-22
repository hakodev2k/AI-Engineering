# Agent Loop Playbook

## Prefer explicit state machines over vague autonomy
A production agent should have named stages, inputs, outputs, transition conditions, retry rules, and terminal states. `Think until done` is not an operating model.

## Plan only as far as evidence allows
Use rolling planning when tool results can change the path. Freeze stable constraints and re-plan only affected downstream work.

## Verification is a separate concern
Execution asks `can I produce the artifact?`; verification asks `does observable reality satisfy acceptance criteria?`. Separate them for consequential tasks.

## Failure classes matter
- transient: timeout/rate limit; bounded retry/backoff
- bad input: correct contract, do not retry unchanged
- tool contract: normalize/fix adapter
- stale state: reconcile with source of truth
- permission: stop and request authority
- strategy: re-plan once; escalate after repeated similarity
- external dependency: wait/checkpoint rather than spin

## Stop conditions
Always include success, blocked, approval-needed, cancelled, retry-exhausted, budget-exhausted, and unrecoverable-inconsistency terminals.

## High-load behavior
Limit work in progress. Parallelize evidence collection, not conflicting writes. Preserve a compact shared contract and synchronize at dependency boundaries rather than broadcasting full context continuously.