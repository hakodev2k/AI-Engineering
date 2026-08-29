# Requirements and NFR Analysis

## Purpose
Convert discovery evidence into prioritized functional and non-functional requirements that can drive architecture and acceptance decisions.

## When to use
Use before designing or validating a customer-facing solution.

## Inputs
Discovery notes, workloads, SLAs/SLOs, security policies, integration needs, budget and timeline.

## Context to inspect
Current baselines, peak traffic, failure tolerance, data sensitivity, recovery objectives, deployment model, and support capabilities.

## Core knowledge
NFRs such as availability, latency, throughput, consistency, recoverability, security, observability, and cost are architecture drivers. Requirements should be measurable and traceable to outcomes.

## Procedure
1. Normalize requirements into clear statements.
2. Separate mandatory constraints from preferences.
3. Quantify performance and reliability targets.
4. Define security, privacy, and compliance boundaries.
5. Capture integration and compatibility requirements.
6. Identify operational and support expectations.
7. Resolve contradictions or document them explicitly.
8. Prioritize requirements and attach acceptance evidence.

## Decision points
Reject arbitrary targets when no business consequence supports them. Tighten requirements where failure would create material risk.

## Common failure patterns
Using adjectives instead of metrics, conflating current behavior with required behavior, and ignoring recovery or operability.

## Verification
Every architecture-driving requirement has an owner, priority, measurable criterion, and evidence source.

## Expected output
A prioritized requirement set suitable for design and evaluation.

## Stop conditions
Stop when mutually incompatible mandatory requirements remain unresolved.