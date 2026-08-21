# Production Release Workflow

## Trigger
Approved production release candidate.

## Stages
1. Collect release inputs.
2. Prioritize risks and blockers.
3. Confirm testing and deployment plan.
4. Execute approved release steps.
5. Monitor results.
6. Verify completion.
7. Communicate outcome.

## Parallel work
QA verification, documentation review, and operational checks can run in parallel.

## Dependencies
Deployment cannot start without approved artifacts and required approvals.

## Retry policy
Retry failed deterministic checks up to two times. Escalate persistent failures.

## Done
Deployment evidence, health checks, and stakeholder communication completed.
