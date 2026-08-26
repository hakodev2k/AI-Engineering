# DNS Architecture Rules

## Purpose
Define safe, resilient DNS architecture decisions.

## Scope
Authoritative and recursive DNS designs, delegation boundaries, and production changes.

## MUST
- DNS architecture MUST document authoritative ownership, delegation boundaries, failure domains, and recovery paths.
- Critical zones MUST have redundant authoritative service across independent failure domains.
- Architecture changes MUST assess availability, security, latency, cache behavior, and operational blast radius.

## MUST NOT
- MUST NOT introduce a single authoritative dependency for critical zones.
- MUST NOT mix recursive and authoritative responsibilities without an explicit security and isolation justification.

## SHOULD
- Designs SHOULD favor simple delegation boundaries and reversible changes.
- Provider or topology choices SHOULD be supported by measured requirements and failure analysis.

## Exceptions
Exceptions require documented context, alternatives, risk, evidence, rollback strategy, and accountable approval.

## Verification
Review architecture diagrams, zone/delegation data, failure tests, monitoring, and recovery evidence before approval.