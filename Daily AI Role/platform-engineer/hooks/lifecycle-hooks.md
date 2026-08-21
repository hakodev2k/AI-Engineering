# Lifecycle Hooks

## intake
Validate user, problem, impact, owner, dependencies, and contract scope before planning.

## pre-design
Require current-state evidence, ownership boundaries, known consumers, and approval authorities.

## pre-implementation
Require compatibility decision, security/reliability review, rollback, telemetry plan, and test strategy.

## pre-production
Require validated automation, explicit blast radius, human approval for restricted actions, support readiness, and rollback trigger.

## post-release
Capture adoption, failures, support demand, SLO behavior, cost signal, and migration progress.

## pre-deprecation
Require affected-consumer inventory, replacement path, deadline, communication, exception route, and rollback/extension authority.

## failure-close
Require Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention.

Hooks should be deterministic, minimal, repeatable, and idempotent where possible.