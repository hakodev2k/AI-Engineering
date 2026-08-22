# Platform Adoption and Migration

## Purpose
Move teams onto improved platform capabilities safely without creating hidden operational or delivery risk.

## When to use
Use for new golden paths, runtime migrations, CI/CD replacements, cluster moves, or deprecated platform services.

## Inputs
Consumer inventory, current patterns, target capability, compatibility gaps, deadlines, and support capacity.

## Context to inspect
Usage telemetry, repositories, dependencies, exceptions, criticality, migration effort, and rollback options.

## Core knowledge
Migration is a product and change-management problem. Reduce switching cost, automate repetitive changes, and preserve reversibility.

## Procedure
1. Inventory consumers and classify criticality.
2. Define target-state benefits and compatibility requirements.
3. Identify blockers and exception classes.
4. Build automated migration tooling where repeatable.
5. Pilot low-risk representative consumers.
6. Publish guides, support channels, and deadlines.
7. Migrate progressively and monitor outcomes.
8. Verify each consumer before decommissioning legacy paths.

## Decision points
Use incentives and better experience before mandates; mandate only when risk, cost, or retirement deadlines justify it.

## Common failure patterns
Unknown consumers, migration without rollback, unrealistic deadlines, manual repetitive work, and declaring success at deployment rather than adoption.

## Verification
Consumer inventory shows verified target-state usage, critical journeys pass, and legacy dependencies are absent before retirement.

## Expected output
A migration plan with cohorts, tooling, support, verification, exceptions, and retirement criteria.

## Stop conditions
Stop decommissioning when critical consumers remain unverified or rollback is unavailable.