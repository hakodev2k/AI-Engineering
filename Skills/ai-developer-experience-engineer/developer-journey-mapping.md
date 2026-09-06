# Developer Journey Mapping

## Purpose
Map the end-to-end experience of engineers building with an AI platform so friction, ambiguity, and operational risk can be prioritized systematically rather than from isolated complaints.

## When to use
Use when improving onboarding, SDKs, APIs, documentation, local development, deployment, evaluation, observability, or support. Do not use when a narrowly scoped defect already has an obvious reproducible fix.

## Inputs
Developer personas, product goals, platform architecture, support tickets, usage analytics, documentation, SDK flows, sample applications, setup steps, deployment paths, and known constraints.

## Preconditions
The target developer segment and primary job-to-be-done must be identifiable.

## Context to inspect
Inspect current documentation, API references, SDKs, CLI flows, authentication, environment setup, rate limits, error messages, deployment guidance, examples, support history, and telemetry. Distinguish first-run friction from expert-scale friction.

## Core knowledge
Developer experience is an end-to-end system. Friction compounds across setup, comprehension, integration, debugging, deployment, and maintenance. Optimize for time-to-first-success, time-to-understanding, debuggability, predictability, and safe production operation rather than only API elegance.

## Procedure
1. Define the developer persona and target outcome.
2. Reproduce the journey from a clean environment.
3. Record every prerequisite, decision, wait state, context switch, and failure opportunity.
4. Capture the information developers need at each step and where they currently obtain it.
5. Identify moments where platform behavior is surprising or weakly observable.
6. Classify friction as discoverability, usability, reliability, performance, policy, tooling, or documentation.
7. Quantify impact using frequency, severity, affected personas, and downstream cost.
8. Map recovery paths for expected failures.
9. Prioritize interventions that remove repeated cognitive or operational cost.
10. Validate improvements by rerunning the journey from a clean environment.

## Decision points
Automate repeated mechanical steps when automation is transparent and reversible. Prefer documentation when the problem is rare and conceptual. Prefer product or tooling changes when many developers repeatedly make the same mistake despite adequate documentation.

## Common failure patterns
Optimizing only the happy path, testing with cached credentials, assuming internal knowledge, ignoring production deployment, using support volume as the only signal, and fixing symptoms without removing the confusing platform behavior.

## Verification
Measure task completion, time-to-first-success, failure rate, recovery time, support burden, and developer comprehension before and after the change. Verify with developers who did not author the tooling.

## Expected output
A journey map with friction points, evidence, severity, root causes, recommended interventions, and validation criteria.

## Stop conditions
Stop and escalate when the platform behavior is security-sensitive, contractual behavior is unclear, required telemetry is unavailable, or a proposed fix requires breaking API changes without an approved migration path.