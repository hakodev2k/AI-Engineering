# Third-Party Security Review

## Purpose
Assess security risk introduced by SaaS providers, APIs, SDKs, libraries, managed services, and other external dependencies before and during use.

## When to use
Use before onboarding a new vendor, granting external access, integrating a third-party API, or renewing a critical dependency.

## Inputs
Vendor documentation, architecture, data flows, permissions, contractual controls, incident history, certifications, API scopes, dependency criticality.

## Context to inspect
Data shared, access scope, authentication method, sub-processors, data residency, retention, breach notification, availability dependencies, audit evidence, and exit/migration options.

## Core knowledge
Third-party risk depends on the access and dependency you create, not only on vendor reputation. Minimize shared data and privileges, verify contractual and technical controls, and plan for provider failure or compromise.

## Procedure
1. Define the business need and dependency criticality.
2. Map data, permissions, credentials, and connectivity granted to the provider.
3. Review authentication, encryption, tenant isolation, logging, and administrative controls.
4. Review relevant independent assurance evidence when available.
5. Assess incident-response and breach-notification commitments.
6. Evaluate availability, backup, recovery, and provider-lock-in risks.
7. Minimize permissions and data scope before integration.
8. Define monitoring, periodic review, and credential-rotation requirements.
9. Establish termination and data-deletion expectations.
10. Record residual risks and accountable acceptance.

## Decision points
Demand deeper review for providers handling sensitive data or privileged access. Compensating controls may reduce risk when provider controls cannot be changed.

## Common failure patterns
Trusting marketing claims, excessive OAuth scopes, permanent vendor credentials, no offboarding plan, ignoring sub-processors, and treating certifications as proof that every integration is safe.

## Verification
Granted permissions match approved scope, contracts and technical evidence support required controls, and termination/revocation procedures are testable.

## Expected output
A documented third-party security assessment with access scope, findings, compensating controls, owners, and residual risk.

## Stop conditions
Escalate when critical assurance evidence is unavailable, contractual requirements are unmet, or the provider requires privileges beyond approved risk tolerance.