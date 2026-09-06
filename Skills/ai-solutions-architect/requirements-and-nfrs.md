# Requirements and Non-Functional Requirements

## Purpose
Translate business goals into testable functional requirements and AI-specific non-functional requirements that can drive architecture and acceptance decisions.

## When to use
Use before detailed architecture, vendor selection, procurement, or production readiness review.

## Inputs
Business requirements, user journeys, regulatory constraints, expected traffic, data classification, SLOs, budget, and operating model.

## Context to inspect
Review current system contracts, integration limits, peak workloads, data residency, incident history, compliance obligations, and user tolerance for latency and error.

## Core knowledge
AI systems need conventional NFRs plus quality, grounding, hallucination tolerance, safety, explainability, human oversight, model availability, prompt/version traceability, and cost-per-task targets.

## Procedure
1. Decompose user outcomes into observable system behaviors.
2. Define functional boundaries and unsupported cases.
3. Quantify latency, throughput, concurrency, availability, recovery, and durability targets.
4. Define quality and safety acceptance thresholds by task class.
5. Specify privacy, residency, retention, and access requirements.
6. Define auditability, traceability, and model/prompt versioning needs.
7. Set cost and capacity constraints.
8. Define human-review and escalation requirements.
9. Resolve conflicting NFRs through explicit trade-offs.
10. Make every critical requirement measurable and testable.

## Decision points
Use stricter quality and oversight for high-impact tasks. Accept higher latency when better reasoning materially improves outcomes. Trade availability against cost only with documented business tolerance.

## Common failure patterns
Using words such as fast, accurate, secure, and scalable without thresholds; mixing goals with implementation choices; and omitting model quality or cost from NFRs.

## Verification
Each requirement has an owner, measurable criterion, priority, and planned verification method.

## Expected output
A prioritized requirements set suitable for architecture evaluation and production acceptance.

## Stop conditions
Stop when critical NFRs conflict without an accountable decision owner or cannot be measured with available evidence.