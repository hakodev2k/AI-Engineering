# Vendor and Technology Evaluation

## Purpose
Evaluate products, SaaS, platforms, and frameworks using architecture requirements, operational fit, security, cost, and exit risk.

## When to use
Use for build-vs-buy decisions, vendor selection, new platforms, databases, observability products, identity services, and strategic dependencies.

## Inputs
Requirements, NFRs, candidate capabilities, pricing, contracts, SLAs, integration needs, security/compliance evidence.

## Preconditions
Mandatory requirements and evaluation criteria are explicit.

## Context to inspect
Roadmap, support model, data portability, APIs, quotas, region availability, security certifications, incident history, pricing dimensions, termination/export processes.

## Core knowledge
Feature count is a weak selection method. Evaluate fit to critical scenarios, total lifecycle cost, operational ownership, lock-in, resilience, and vendor viability.

## Procedure
1. Separate mandatory, differentiating, and optional requirements.
2. Weight criteria by business impact.
3. Validate claims through documentation and targeted proof-of-concept.
4. Evaluate integration and identity fit.
5. Review security, compliance, and data handling.
6. Review SLA and support escalation.
7. Model total cost under realistic usage.
8. Assess export, migration, and termination paths.
9. Identify vendor concentration risk.
10. Record evidence, assumptions, and recommendation.

## Decision points
Buy commodity capability when vendor maturity and economics beat internal ownership. Build when the capability is strategically differentiating or vendor constraints are unacceptable.

## Common failure patterns
Demo-driven selection, procurement-only criteria, ignoring exit cost, hidden usage pricing, proof-of-concept on toy scenarios.

## Verification
Top candidate satisfies mandatory scenarios and risks are explicitly accepted.

## Expected output
Evidence-based vendor/technology recommendation with lifecycle trade-offs.

## Stop conditions
Stop when contractual, security, or data-processing terms required for evaluation are unavailable.