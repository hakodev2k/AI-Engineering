# Golden Path Engineering

## Purpose
Create supported, reusable paths for common engineering workflows without blocking legitimate exceptions.

## When to use
Use for recurring service creation, deployment, configuration, or operational workflows.

## Inputs
Workflow evidence, platform capabilities, standards, security controls, and team constraints.

## Context to inspect
Current manual steps, failure points, exceptions, templates, CI/CD, runtime requirements, and ownership.

## Core knowledge
Golden paths should optimize the common case, expose important choices, remain versioned, and provide escape hatches.

## Procedure
1. Map the current workflow.
2. Identify mandatory controls and variable choices.
3. Remove unnecessary decisions.
4. Encode safe defaults in templates or APIs.
5. Add validation and actionable errors.
6. Document supported customization and escape paths.
7. Pilot with real workloads.
8. Measure completion time and failure rate.
9. Version and evolve the path.

## Decision points
Automate stable repetition; leave volatile or high-context decisions explicit. Require a path only where governance demands it.

## Common failure patterns
Over-abstraction, stale templates, hidden coupling, no upgrade path, and treating exceptions as user mistakes.

## Verification
A representative team completes the workflow independently, generated assets pass controls, and upgrades are testable.

## Expected output
A versioned golden path with documentation, defaults, validation, ownership, and measurable outcomes.

## Stop conditions
Stop when the workflow is not sufficiently understood or mandatory controls conflict.