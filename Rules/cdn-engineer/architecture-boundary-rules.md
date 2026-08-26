# Architecture Boundary Rules

## Purpose
Keep CDN responsibilities explicit so delivery logic does not silently become an ungoverned application tier.

## Scope
Applies to ownership between clients, CDN, edge compute, DNS, security controls, origins, and application services.

## MUST
- Each edge behavior MUST have a clear responsibility and owning system/team.
- Business-critical transformations at the edge MUST have a documented contract with origins and clients.
- Authentication, authorization, caching, and routing boundaries MUST be explicit.
- Significant architecture changes MUST document constraints, alternatives, failure modes, reversibility, and operational impact.
- Provider-specific dependencies MUST be identified when they affect portability or recovery.

## MUST NOT
- MUST NOT duplicate authoritative business logic across edge and origin without a consistency strategy.
- MUST NOT move logic to the edge solely because the platform permits it.
- MUST NOT obscure ownership of data correctness or access control.

## SHOULD
- Keep the CDN focused on delivery, protection, routing, and bounded edge functions.
- Prefer simple boundaries that remain diagnosable during incidents.
- Record material architecture decisions.

## Exceptions
Complex edge responsibility requires demonstrated latency/resilience/security benefit, lifecycle ownership, tests, and architecture approval.

## Verification
Review architecture diagrams, contracts, configuration/code ownership, ADRs, failure tests, and request traces across edge-origin boundaries.