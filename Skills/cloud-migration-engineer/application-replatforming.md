# Application Replatforming

## Purpose
Introduce bounded platform changes during migration to reduce operational burden or improve scalability without a full application redesign.

## When to use
Use when managed runtimes, databases, caches, queues, containers, or storage can replace infrastructure components with acceptable code and testing effort.

## Inputs
Current architecture, platform dependencies, code/configuration, runtime support, SLOs, deployment model, target managed-service constraints, cost, and test coverage.

## Preconditions
The replatform scope must be explicit and separable from unrelated modernization work.

## Context to inspect
Inspect filesystem assumptions, sessions, process lifecycle, ports, environment configuration, connection handling, background jobs, state, autoscaling behavior, health checks, and deployment pipelines.

## Core knowledge
Replatforming succeeds when change is constrained. Managed services impose limits and different failure modes. Statelessness, connection management, startup/shutdown behavior, and observability often require adjustment.

## Procedure
1. Define the operational problem the replatform should solve.
2. Establish a strict change boundary.
3. Compare target service constraints with current workload behavior.
4. Identify code/configuration changes and compatibility gaps.
5. Build the target through infrastructure automation.
6. Externalize configuration and secrets.
7. Adapt health checks, lifecycle, state, and connection behavior.
8. Add platform-specific telemetry.
9. Run unit, integration, resilience, and performance tests.
10. Rehearse deployment and rollback.
11. Validate autoscaling and failure recovery where applicable.
12. Execute migration using progressive exposure when possible.
13. Measure operational benefit against the original objective.

## Decision points
Choose replatform over rehost when bounded change removes meaningful toil or risk. Choose refactor instead when platform constraints force pervasive design changes. Avoid managed services whose limits conflict with core workload requirements.

## Common failure patterns
Unbounded modernization; hidden local state; connection storms; assuming managed means no operations; missing service quotas; health checks that do not reflect readiness; no rollback path to the previous platform.

## Verification
Acceptance tests pass on the target platform; SLOs are met; scaling and failure tests behave as expected; operational procedures and telemetry are complete; benefits are measurable.

## Expected output
A bounded replatformed workload with documented compatibility changes, deployment/rollback procedures, operational ownership, and measured outcomes.

## Stop conditions
Escalate when target service limits require major redesign, test coverage cannot protect the change, rollback is unsafe, or expected operational value no longer justifies the migration risk.