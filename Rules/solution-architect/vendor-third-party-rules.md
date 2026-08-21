# Vendor and Third-Party Rules

## Purpose
Manage architectural, operational, security, and business risk from external products and services.

## Scope
Applies to SaaS, APIs, managed services, commercial libraries, open-source dependencies, and strategic vendors.

## MUST
- Critical third-party dependencies MUST be evaluated for availability, security, support, data handling, cost, quotas, and exit strategy.
- Vendor capabilities used in architecture MUST be verified against current official documentation or contract evidence.
- Data shared with third parties MUST comply with classification, privacy, and contractual requirements.
- Critical vendor outages MUST have defined impact and fallback or business-continuity response.
- Lock-in MUST be explicitly accepted when switching cost is material.

## MUST NOT
- MUST NOT treat marketing claims as architecture guarantees.
- MUST NOT build critical workflows on undocumented behavior.
- MUST NOT introduce a vendor dependency without identifying operational ownership.

## SHOULD
- Prefer abstraction only where realistic portability or testing value exists.
- Monitor critical dependency health and contract changes.

## Exceptions
Low-impact tools may use lighter evaluation when replacement is easy.

## Verification
Review contracts, official docs, security reports, architecture dependency maps, cost models, outage plans, and exit/migration assumptions.