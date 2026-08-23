# Risk-Based Testing

## Purpose
Allocate testing effort according to business and technical risk instead of treating every feature equally.

## When to use
Use when scope exceeds available time, systems contain critical paths, or release confidence must be prioritized.

## Inputs
Feature scope, architecture, usage, change set, defect history, impact classifications.

## Context to inspect
Inspect changed components, dependency blast radius, customer frequency, security/data sensitivity, reversibility, and existing coverage.

## Core knowledge
Risk combines probability and consequence. Change complexity, coupling, novelty, and historical instability raise probability; money, safety, privacy, availability, and customer reach raise impact.

## Procedure
1. Inventory testable areas.
2. Score likelihood and impact with explicit criteria.
3. Identify high-risk combinations and boundary conditions.
4. Map each risk to the cheapest reliable test level.
5. Add exploratory charters for unknowns.
6. Prioritize execution by risk and feedback speed.
7. Record deferred coverage and residual risk.
8. Re-score when evidence changes.

## Decision points
Increase depth for irreversible or high-blast-radius failures. Reduce redundant tests where lower layers already provide strong evidence.

## Common failure patterns
Calling everything high risk, scoring without evidence, ignoring integration risks, and silently dropping low-priority tests.

## Verification
Confirm critical risks have executable checks and deferred risks are visible to decision makers.

## Expected output
A ranked risk matrix linked to test coverage and residual risks.

## Stop conditions
Escalate when risk tolerance or business impact cannot be determined.