# Lifecycle Hooks
## Before task start
Trigger: accepted frontend request. Action: validate goal, route, API dependency, user impact, accessibility/performance risks. Block on missing critical contract.

## After planning
Check component ownership, state source-of-truth, async states, test plan and approval boundaries. Block contradictory ownership.

## Before implementation
Confirm affected shared components/contracts and current tests. Record assumptions.

## After implementation
Run deterministic lint/type/test/build commands available in the project; inspect console/runtime errors and changed user states. Failure blocks completion.

## Before review
Collect diff summary, behavior evidence, a11y findings, tests and residual risks.

## After failure
Create incident/failure record, identify root cause, process improvement and prevention owner.

## Before production action
Verify approvals, rollback path and observability. Never bypass a failed critical gate automatically.