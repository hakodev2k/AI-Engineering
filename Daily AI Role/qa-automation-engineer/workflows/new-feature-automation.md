# Workflow: New Feature Automation

## Trigger
A feature or behavioral change needs automated verification.

## Goal
Deliver the smallest maintainable automated evidence set that adequately covers product risk.

## Inputs
`schemas/task-contract.schema.json` compatible task, requirements, repository, environment access.

## Preconditions
Critical requirement conflicts are identified; target environment is safe.

## Stages
1. **Intake and priority — Coordinator**  
   Validate task contract with `scripts/validate-package.py` and classify severity, deadline, dependencies, and approval boundaries.
2. **Context discovery — Repository Explorer**  
   Locate behavior, existing coverage, commands, fixtures, and impacted integration points.
3. **Risk and scenario design — Coordinator**  
   Apply `skills/test-strategy.md`; produce/update `templates/test-plan.md`.
4. **Parallel preparation**  
   Data/environment readiness and review of API/UI coverage can proceed in parallel only when they do not mutate shared state.
5. **Implementation — Automation Implementer**  
   Use `skills/playwright-automation.md` and/or `skills/api-automation.md`.
6. **Implementation gate**  
   Execute the after-implementation hook from `hooks/lifecycle-hooks.md`.
7. **Independent review — Test Reviewer**
8. **Fix loop — Implementer → Reviewer**  
   Maximum two review-fix cycles. Remaining blockers escalate.
9. **Verification — Verification Agent**  
   Run `scripts/run-quality-gates.ps1` plus task-specific checks.
10. **Delivery — Coordinator**  
   Produce `templates/handoff.md`.

## Blocking dependencies
Unresolved acceptance criteria, unavailable mandatory environment, unsafe data setup, or required approval.

## Synchronization point
Implementation starts only after scope/scenarios and mutable-data ownership are agreed.

## Conflict resolution
Requirement source-of-truth wins over inferred behavior. Conflicting artifacts are escalated, not averaged.

## Checkpoints
After discovery, after test-plan approval for high-risk work, after implementation gates, after independent review, before delivery.

## Retry policy
A failed deterministic command may be rerun once after correcting the identified cause. Nondeterministic failures enter `flaky-test-recovery.md`.

## Failure path
Classify failure, preserve evidence, route to responsible owner, and stop if further action would exceed authority.

## Escalation
Security controls, production activity, destructive setup, ambiguous release acceptance, or unresolved critical defect require human decision.

## Definition of Done
`checklists/definition-of-done.md` is satisfied and verification evidence exists.
