# Self-Service Environments

## Purpose
Enable teams to create safe, consistent development and test environments without platform tickets.

## When to use
Use when environment provisioning is slow, inconsistent, costly, or manually controlled.

## Inputs
Environment types, dependencies, data needs, cloud resources, budgets, and security constraints.

## Context to inspect
Provisioning steps, secrets, DNS, databases, quotas, cleanup, test data, and deployment tooling.

## Core knowledge
Useful environments balance fidelity, speed, isolation, cost, and lifecycle automation.

## Procedure
1. Define supported environment classes.
2. Identify minimum required dependencies and data.
3. Automate provisioning through approved IaC.
4. Generate isolated identity, network, and configuration boundaries.
5. Add TTLs and cleanup automation where appropriate.
6. Expose status and actionable failures.
7. Track cost and capacity.
8. Test creation, update, and deletion paths.

## Decision points
Use ephemeral environments for short-lived validation; shared environments may suit expensive dependencies. Never copy sensitive production data without approved controls.

## Common failure patterns
Orphaned resources, shared mutable dependencies, secret reuse, uncontrolled cost, and environments that differ materially from production.

## Verification
Provisioning is repeatable, isolation tests pass, cleanup works, and representative workloads behave as expected.

## Expected output
A self-service environment workflow with lifecycle, isolation, cost, and support guarantees.

## Stop conditions
Escalate when required data handling or network access violates policy.