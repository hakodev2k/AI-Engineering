# Workflow: Safe Feature Flag Rollout

## Trigger
A feature flag is introduced, targeting/default changes, or production exposure is increased.

## Entry conditions
- A flag contract exists.
- Repository/config source of truth is identifiable.
- Required telemetry can be queried.
- Required approvals are obtainable before restricted actions.

## Inputs
Flag contract, repository root, target environment, acceptance criteria, current flag state, telemetry sources.

## Stages

1. **Discover** — Rollout Planner runs `scripts/scan-feature-flags.py`, traces evaluation points, side effects, tests, and telemetry.
2. **Validate** — Run `scripts/validate-flags.py`. Any blocking validation failure stops execution.
3. **Plan** — Rollout Planner selects the next allowed percentage, cohort, success thresholds, rollback thresholds, observation evidence, and previous state.
4. **Approval checkpoint** — Production default changes, rollout above 25%, kill-switch removal, breaking contracts, or security bypass require explicit human approval. Stop here without it.
5. **Execute one step** — Rollout Executor applies only the approved state and captures post-change evidence.
6. **Observe** — Collect evidence for all declared metrics. Do not expand exposure during this stage.
7. **Verify** — Rollout Verifier independently executes `skills/verify-rollout-state.md`.
8. **Decision**:
   - `verified`: return to planning for the next allowed step.
   - `rollback_required`: stop expansion and request/perform the approved rollback to the preserved previous state.
   - `verification_incomplete`: stop and collect missing evidence.
   - `blocked`: stop and escalate the blocking condition.
9. **Complete** — At 100%, verify the flag remains reversible through the required rollback window and create a cleanup recommendation for the temporary flag.

## Checkpoints
After validation, before every production mutation, after every mutation, before every exposure increase, and before final completion.

## Retry rules
- Read-only telemetry or provider reads: maximum 2 retries for transient failures.
- Mutations: retry at most once only after proving the previous attempt did not apply.
- Validation failures are not retryable without changed inputs.
- Permission failures stop immediately.

## Evidence preserved
Contract, scanner output, validation result, previous state, executed state, approval reference, metric snapshots, verifier decision, and unresolved risks.

## Failure paths
- Missing owner/kill switch/metrics or stale flag → blocked.
- Rollback threshold exceeded → rollback required.
- Ambiguous mutation result → fetch current state and stop expansion.
- Missing telemetry → verification incomplete.
- Provider unavailable after retries → blocked with preserved evidence.

## Definition of Done
- Required context and all evaluation points were inspected.
- Contract validation passes.
- Every executed production change had required approval.
- Current state matches the declared rollout state.
- Success and rollback conditions are verified with evidence.
- No unintended config changes remain.
- 100% rollout is independently verified or the system has safely rolled back.
- Remaining cleanup/risk is documented.
