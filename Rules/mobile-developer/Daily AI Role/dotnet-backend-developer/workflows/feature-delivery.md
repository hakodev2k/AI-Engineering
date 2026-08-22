# Workflow: Feature Delivery

## Trigger
Approved backend feature or API change.

## Goal
Deliver the smallest production-ready change that satisfies acceptance criteria without unnecessary architecture expansion.

## Inputs
Requirement, acceptance criteria, deadline, repository, contract/security/data constraints.

## Preconditions
- Business objective is understood.
- Critical ambiguity is identified.
- Approval exists for any intentional breaking behavior.

## Stages
1. **Intake and clarify — Primary role**
   - Separate facts, assumptions, open questions, risks.
   - Define measurable completion criteria.
2. **Repository exploration — Repository Explorer**
   - Trace similar feature and affected boundaries.
3. **Plan — Primary role**
   - Choose minimal design, changed files, tests, rollout concerns.
4. **Parallel specialist analysis — when independent**
   - Database Investigator for persistence impact.
   - Security/performance checks may run in parallel when they do not depend on implementation.
5. **Implementation — Implementation Agent**
   - Implement vertical slice and tests.
6. **Automated quality checkpoint**
   - Build/test/static checks.
7. **Independent review — Code Reviewer**
8. **Fix loop — Implementation Agent → Code Reviewer**
   - Maximum 2 review/fix iterations for newly introduced findings; then escalate unresolved blockers.
9. **Verification — Verification Agent**
10. **Delivery — Primary role**
   - Summarize changes, evidence, risks, and required rollout/approval actions.

## Parallelizable steps
Repository exploration of independent modules, persistence analysis, contract review, and test discovery may run concurrently after the task boundary is clear.

## Blocking dependencies
Implementation starts only after critical requirements and approval boundaries are known. Verification waits for blocking review findings to be resolved.

## Shared context
Acceptance criteria, repository map, approved assumptions, architecture constraints, and status of approval-required actions.

## Synchronization points
- End of exploration: consolidate relevant paths and risks.
- End of planning: one approved execution plan.
- End of review: no unresolved blocking findings.

## Retry policy
- Tool/transient command failures: retry at most 2 times when retry is safe.
- Test failures caused by code: fix and rerun; no arbitrary retry without a change or evidence.
- External dependency verification: maximum 2 safe retries, then mark blocked and preserve evidence.

## Failure path
Missing critical requirement → stop affected implementation and escalate with explicit options.
Failed verification → return to implementation once with evidence; repeated unresolved failure becomes a blocker.

## Human approval
Required before breaking API contracts, destructive migrations/data changes, production deployment/configuration, secret changes, or irreversible operations.

## Definition of Done
- Acceptance criteria mapped to implementation/tests.
- Required code and documentation exist.
- Build and relevant tests pass.
- Review has no blocking finding.
- Verification evidence exists.
- Risks and approval-required rollout steps are recorded.
