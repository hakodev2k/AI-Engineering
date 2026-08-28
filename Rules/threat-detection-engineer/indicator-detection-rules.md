# Indicator Detection Rules

## Purpose
Define safe use of indicators of compromise without over-relying on brittle matches.

## Scope
Applies to hashes, domains, IPs, URLs, certificates, file paths, identities, and other discrete indicators.

## MUST
- Indicators MUST have source, confidence, age, scope, and expiration or review metadata where practical.
- Matching logic MUST account for normalization and field semantics appropriate to each indicator type.
- High-severity indicator alerts MUST consider context such as asset criticality, directionality, and known benign infrastructure.
- Expired or revoked intelligence MUST be removed or downgraded through a controlled lifecycle.

## MUST NOT
- MUST NOT treat a single low-confidence indicator match as proof of compromise.
- MUST NOT retain indicators indefinitely without review.
- MUST NOT mix allowlisted and malicious indicators without explicit precedence rules.

## SHOULD
- Indicator detections SHOULD enrich alerts with confidence, source, first-seen, and last-seen context.
- Stable behavioral detections SHOULD complement short-lived indicators.

## Exceptions
Exceptions require rationale, bounded duration, owner, and documented effect on false-positive or false-negative risk.

## Verification
Inspect intelligence metadata, normalization tests, expiration jobs, match samples, allowlist precedence, and alert enrichment.