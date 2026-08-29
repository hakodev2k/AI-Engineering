# Third-Party Security Architecture

## Purpose
Assess and design secure architectural boundaries for SaaS, vendors, managed services, partners, and externally operated components.

## When to use
Use before integrating third-party systems that process sensitive data, receive privileged access, or become critical dependencies.

## Inputs
Vendor architecture, integration contract, data flows, authentication model, service commitments, compliance evidence, exit requirements, business criticality.

## Preconditions
The intended data, access, and dependency relationship with the third party is defined.

## Context to inspect
SSO and federation, API scopes, network connectivity, data residency, encryption, logging, administrative access, subprocessors, backup, incident notification, and termination procedures.

## Core knowledge
Third-party risk is architectural when external systems become part of trust, identity, data, or availability boundaries. Due diligence should be tied to actual exposure rather than generic questionnaires alone.

## Procedure
1. Define business purpose and minimum required integration scope.
2. Map data, identity, administrative, and network trust boundaries.
3. Minimize data shared and privileges granted.
4. Prefer federated identity and revocable credentials.
5. Evaluate provider security evidence against actual risk.
6. Define monitoring, logging, and incident notification requirements.
7. Design outage and degradation behavior.
8. Establish data return, deletion, credential revocation, and exit procedures.
9. Record residual vendor dependencies and owners.
10. Reassess when service scope or provider architecture changes.

## Decision points
Require stronger isolation and contractual controls when the provider handles high-impact data or privileged operations. Prefer substitutable interfaces when vendor dependency is strategically risky.

## Common failure patterns
Overbroad API scopes, unmanaged vendor accounts, trusting certifications without architecture review, no exit plan, and critical dependencies without degraded-mode design.

## Verification
Validate access scope, data flows, revocation, logging, outage behavior, and termination procedures using representative scenarios.

## Expected output
A third-party security architecture with explicit trust boundaries, controls, dependencies, and exit conditions.

## Stop conditions
Stop when the provider cannot disclose enough information to assess material risk, required contractual controls are unavailable, or residual exposure exceeds approval authority.