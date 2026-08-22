# Definition of Done — QA Automation Engineer

A task is complete only when all applicable statements are true.

## Scope and contract
- [ ] Objective and expected output are explicit.
- [ ] Critical acceptance criteria are known or unresolved ambiguity is escalated.
- [ ] In-scope and out-of-scope behavior is recorded.
- [ ] Facts and assumptions are separated.

## Coverage
- [ ] High-risk behavior maps to an automated or explicit manual verification method.
- [ ] Test layer is justified; UI automation is not used where a cheaper reliable layer is sufficient.
- [ ] Negative/boundary/permission/state-transition scenarios are included where material.
- [ ] Regression impact has been assessed.

## Implementation quality
- [ ] Tests are deterministic enough for their environment.
- [ ] Mutable data is isolated and parallel-safe.
- [ ] No arbitrary sleep hides synchronization.
- [ ] Assertions prove meaningful behavior.
- [ ] Selectors/contracts are stable and maintainable.
- [ ] No secrets, real personal data, or production endpoints were introduced improperly.

## Review
- [ ] Independent review completed for major deliverables.
- [ ] Blocking findings are resolved or escalated.
- [ ] Diff contains no unrelated changes.

## Verification
- [ ] Required focused tests executed.
- [ ] Relevant regression suite executed or exclusion is documented.
- [ ] Build/lint/static gates required by the repository passed.
- [ ] Skipped/quarantined critical tests were inspected.
- [ ] Work performed is distinguished from work verified.
- [ ] Evidence identifies command/scope, environment, and result.

## Risk and approval
- [ ] Known defects/limitations are documented.
- [ ] Dependencies and blockers are resolved or owned.
- [ ] Required human approval exists for destructive, production, security-sensitive, or risk-acceptance decisions.

## Handoff
- [ ] Output contract is satisfied.
- [ ] Another engineer can continue from the handoff.
- [ ] No blocking issue remains hidden.
