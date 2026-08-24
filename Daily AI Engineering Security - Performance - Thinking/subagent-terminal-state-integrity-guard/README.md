# Subagent Terminal-State Integrity Guard

**Category:** Thinking

## Problem
Delegated agents can be reported as `completed` even when required tool results, final output, or artifacts are missing. Parent orchestrators that trust lifecycle status can convert truncation or deferred execution into unsupported conclusions.

## Evidence
See `evidence/research.md`. Fresh August 2026 Claude Code reports document deferred tool calls reported as success, background agents returning empty/partial results while marked completed, usage-limit termination rendered as done, and high-token subagents returning a description instead of the required deliverable.

## Existing approach
Common mitigations are prompt instructions, trusting task status, checking a file after completion, narrowing subagent scope, or manually re-running suspicious tasks.

## Existing limitations
These controls are incomplete because transport status is not semantic completion, prompt guidance cannot repair harness truncation, and blind reruns can repeat side effects or repay large context.

## Proposed improvement
Insert an evidence-backed acceptance gate between child termination and parent consumption. Reconcile tool calls/results, terminal reasons, final-output requirements, and artifacts. Normalize the outcome to `accepted`, `incomplete`, `failed`, or `needs_review`; recover only the residual work with bounded retries.

## Architecture
```text
child terminal event
  -> post-child completion gate
  -> deterministic terminal-state validator
  -> accepted -----------------------> parent consumes result
  -> incomplete/failed/needs_review -> bounded verify-and-recover workflow
                                      -> independent terminal-state verifier
```

## Package tree
```text
subagent-terminal-state-integrity-guard/
├── README.md
├── evidence/research.md
├── hooks/post-child-completion-gate.md
├── rules/terminal-state-rules.md
├── scripts/validate_terminal_state.py
├── skills/deliverable-acceptance.md
├── subagents/terminal-state-verifier.md
├── tests/test_terminal_state_validator.py
└── workflows/verify-and-recover.md
```

## Installation
Requires Python 3.9+; the validator uses only the standard library. Copy the package directory into the host's policy/agent repository and invoke the hook after every child terminal event.

## Configuration
Produce a child-state JSON with `status`, `terminal_reason`, `result`, optional `tool_calls`, `tool_results`, `required_result_min_chars`, `required_result_contains`, and `required_artifacts`. Relative artifact paths resolve from the state-file directory.

## Usage
```bash
python3 scripts/validate_terminal_state.py --state child-state.json
```
Exit code 0 means `accepted`; non-zero blocks automatic acceptance and routes to recovery/review.

Run unit tests:
```bash
python3 -m unittest tests/test_terminal_state_validator.py
```

## Workflow
Follow `workflows/verify-and-recover.md`: Observe → measure evidence → diagnose → form one residual hypothesis → recover missing work → measure again → independently verify. Automated recovery is limited to two attempts.

## Metrics
False-completion acceptance rate; reconciled tool-call percentage; deliverable verification coverage; retry/rework rate; tokens/time wasted on full reruns; unsupported parent conclusions caused by child output.

## Verification
- Deferred/unanswered tool calls must be rejected.
- Explicit blocking terminal reasons must not be accepted even if status is `completed`.
- Missing/undersized artifacts must be rejected.
- Valid completed fixtures must be accepted.
- High-impact recovered outputs require the independent verifier.

## Safety
The validator is read-only and does not execute child-controlled commands. Side-effecting retries require idempotency evidence or human approval. Unknown states fail closed to review rather than success.

## Failure handling
Detection: non-zero validator result or failed artifact verifier. Evidence: persisted decision and reasons. Retry: residual-only, maximum two. Fallback: preserve partial evidence and request review. Escalation: any ambiguous side effect or repeated failure. Stop: accepted+verified, non-retryable failure, unsafe retry, or retry limit reached.

## Definition of Done
**Implemented:** rules, skill, verifier, workflow, hook, validator, tests, and research exist. **Measured:** baseline and post-gate acceptance/rework metrics are captured in the adopting runtime. **Verified:** known false-completion fixtures are blocked, valid fixtures pass, paths/references are consistent, recovery is bounded, and no acceptance rule is weakened to hide failure.

## Customization
Add host-specific terminal reasons and deliverable rules conservatively. New statuses should remain non-accepted until their semantics are documented and tested.