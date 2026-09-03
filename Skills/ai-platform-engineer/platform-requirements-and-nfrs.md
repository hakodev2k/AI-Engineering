# Platform Requirements and NFRs

## Purpose
Define the functional and non-functional requirements for an internal AI platform before implementation. This prevents teams from building model, agent, retrieval, or evaluation infrastructure without explicit service boundaries, SLOs, security requirements, or adoption goals.

## When to use
Use when creating or materially changing an AI platform, onboarding a new workload class, or resolving architectural ambiguity between product teams and platform teams.

## Inputs
- Product and engineering use cases
- Expected model and agent workloads
- User/team personas
- Existing infrastructure and cloud constraints
- Security, compliance, privacy, cost, latency, and availability targets

## Context to inspect
Inspect current AI applications, deployment patterns, provider usage, secrets handling, evaluation workflows, observability, incident history, cost data, developer friction, and organizational ownership boundaries.

## Core knowledge
AI platforms are socio-technical systems. A successful platform optimizes developer velocity, reliability, governance, and cost without hiding critical model behavior. NFRs should be measurable and tied to workload classes rather than expressed as vague goals.

## Procedure
1. Identify platform users and their recurring jobs.
2. Classify workloads by latency, throughput, privacy, availability, and model criticality.
3. Define platform capabilities required to support those workloads.
4. Define explicit SLOs for platform APIs and control-plane operations.
5. Define tenancy, identity, authorization, secrets, and audit requirements.
6. Define cost attribution and quota requirements.
7. Define deployment, rollback, and versioning expectations.
8. Define evaluation and release-gating expectations for AI artifacts.
9. Define observability and incident-response requirements.
10. Identify provider-specific constraints and portability needs.
11. Rank requirements by business value and operational risk.
12. Record unresolved decisions and ownership.

## Decision points
- Centralize capabilities only when multiple teams benefit from shared policy or economies of scale.
- Preserve team-level escape hatches for specialized workloads when safe and observable.
- Prefer measurable SLOs over blanket promises such as "high availability."

## Common failure patterns
- Treating the platform as a collection of wrappers.
- Ignoring developer experience.
- Over-standardizing model choice.
- Missing cost attribution.
- Defining no degraded-mode behavior.
- Building before workload classes are understood.

## Verification
A requirement is implemented when it is documented and owned; it is verified when acceptance tests, SLO instrumentation, and representative workload tests demonstrate that the platform can meet it.

## Expected output
A prioritized platform requirement set with workload classes, NFRs, ownership, acceptance criteria, and unresolved decisions.

## Stop conditions
Stop and escalate when core ownership, compliance boundaries, or workload criticality cannot be determined.