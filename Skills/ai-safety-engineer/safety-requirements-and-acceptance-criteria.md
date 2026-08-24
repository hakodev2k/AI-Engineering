# Safety Requirements and Acceptance Criteria

## Purpose
Translate abstract safety goals into testable engineering requirements and release gates.

## When to use
Use before implementation, evaluation design, procurement, or release approval.

## Inputs
Risk assessment, product requirements, policies, threat model, user research, incident learnings.

## Context to inspect
System capabilities, affected workflows, failure consequences, monitoring, fallback behavior, and existing test infrastructure.

## Core knowledge
A useful safety requirement names the protected property, operating conditions, measurable threshold, evidence source, and failure response. Aspirational language is not an acceptance criterion.

## Procedure
1. Convert each material hazard into one or more control objectives.
2. Define observable safety properties.
3. Specify normal, adversarial, degraded, and boundary conditions.
4. Define measurable thresholds and tolerances.
5. Specify required evidence and test ownership.
6. Define release-blocking versus advisory criteria.
7. Define rollback or containment behavior for post-release violations.
8. Review requirements for contradictions and unverifiable claims.

## Decision points
Use hard gates for severe, reproducible failures; use monitored thresholds for stochastic behavior when zero failures are unrealistic.

## Common failure patterns
Using vague terms such as safe or robust; testing only happy paths; thresholds without confidence intervals; criteria that can be gamed by narrow benchmarks.

## Verification
Each requirement must be independently testable and linked to a hazard, test, threshold, and owner.

## Expected output
A versioned set of safety requirements and release acceptance criteria.

## Stop conditions
Stop when critical requirements cannot be measured or stakeholders disagree on unacceptable outcomes.