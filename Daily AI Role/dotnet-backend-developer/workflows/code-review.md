# Workflow: Code Review and Verification

## Trigger
A backend implementation is ready for independent review.

## Goal
Detect correctness, security, performance, compatibility, operational, and maintainability defects before delivery.

## Inputs
Objective, acceptance criteria, final diff, relevant tests, implementation evidence.

## Stages
1. Code Reviewer maps changed behavior to acceptance criteria.
2. Review API, auth, validation, async/cancellation, resource lifetime, persistence, concurrency, retries, observability, tests, and scope.
3. Findings are ordered Critical → High → Medium → Low with evidence and action.
4. Implementation Agent fixes blocking findings.
5. Reviewer rechecks changed areas; maximum 2 review/fix iterations before escalating unresolved blockers.
6. Verification Agent runs objective checks independently.
7. Primary role consolidates final status.

## Failure policy
- Failed tests are not waived without an explicit risk decision by an authorized human.
- Missing environment capability is recorded as `blocked`, not `passed`.
- A reviewer disagreement is resolved using requirement evidence, tests, runtime behavior, or escalation—not authority-by-assertion.

## Definition of Done
No blocking review finding remains; all required verification checks pass or an authorized exception explicitly accepts the residual risk.
