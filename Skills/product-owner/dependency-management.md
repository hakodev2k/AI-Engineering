# Product Dependency Management

## Purpose
Make product dependencies visible and actively manage sequencing, ownership, and fallback options so they do not become surprise delivery blockers.

## When to use
Use for cross-team work, external vendors, shared platforms, migrations, integrations, and coordinated releases.

## Inputs
Backlog, architecture context, teams, external contracts, target outcomes, timelines, and known dependencies.

## Context to inspect
Inspect dependency direction, required interfaces, decision owners, lead times, service-level expectations, and alternative paths.

## Core knowledge
Dependencies create coordination cost and schedule risk. Product ownership should distinguish true prerequisite dependencies from preferred sequencing and reduce coupling where possible.

## Procedure
1. Identify each dependency and why it exists.
2. Classify it as hard, soft, external, technical, or decision dependency.
3. Define the required deliverable or contract precisely.
4. Assign owners on both sides.
5. Establish needed-by dates and confidence.
6. Explore decoupling, mocks, adapters, flags, or sequencing alternatives.
7. Track leading signals rather than waiting for missed dates.
8. Reorder scope when dependency risk changes.
9. Communicate impact early.
10. Retire dependency tracking once verified complete.

## Decision points
Decouple when coordination risk exceeds implementation cost. Delay dependent scope when fallback behavior would create unacceptable user or operational risk.

## Common failure patterns
Dependencies hidden in tickets, vague promises, no owner, treating estimates as commitments, and discovering interface incompatibility at integration time.

## Verification
Dependencies have explicit contracts, owners, dates or conditions, fallback plans where appropriate, and integration verification.

## Expected output
A dependency map with ownership, sequencing, risk, and mitigation actions.

## Stop conditions
Escalate when another organization will not commit to required decisions or when contractual/vendor constraints threaten the product goal.