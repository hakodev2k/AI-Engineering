# Vendor and Third-Party Integration Rules

## Purpose
Manage technical, security, operational, and continuity risks introduced by external providers.

## Scope
Applies to SaaS APIs, partner integrations, managed gateways, external data providers, and vendor-hosted connectors.

## MUST
- Third-party dependencies MUST document owner, purpose, contract or SLA assumptions, authentication model, rate limits, data exchanged, support path, and failure impact.
- Vendor-specific behavior that affects correctness MUST be isolated and documented.
- Security and privacy requirements MUST be validated before sensitive data is transferred.
- Exit, replacement, or degraded-operation options MUST be considered for business-critical dependencies.
- Material vendor contract, API, certificate, or deprecation notices MUST have an accountable review process.

## MUST NOT
- MUST NOT treat vendor documentation as proof that local configuration is secure or correct.
- MUST NOT expose additional data to a vendor merely because its API accepts it.
- MUST NOT auto-adopt major vendor SDK or API changes without compatibility and risk review.

## SHOULD
- Critical vendor assumptions SHOULD be tested through synthetic checks or periodic validation.
- Vendor lock-in SHOULD be an explicit trade-off, not an accidental consequence.

## Exceptions
Document the dependency constraint, business rationale, risk, alternatives considered, mitigation, and approval.

## Verification
Review contracts, architecture records, security assessment, configuration, data flows, dependency inventory, deprecation notices, and failover evidence.