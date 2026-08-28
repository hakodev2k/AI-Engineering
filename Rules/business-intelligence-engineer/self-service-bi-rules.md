# Self-Service BI Rules

## Purpose
Enable autonomous analysis without sacrificing semantic consistency or governance.

## Scope
Applies to shared datasets, certified models, ad hoc exploration, report authoring, and analyst enablement.

## MUST
- Self-service users MUST have a governed path to discover certified metrics and datasets.
- Certified assets MUST identify ownership, freshness, intended use, and known limitations.
- Shared self-service models MUST enforce the same access restrictions as their underlying data.
- Promotion from ad hoc analysis to a production asset MUST include review and validation.

## MUST NOT
- MUST NOT label an asset certified without defined ownership and validation evidence.
- MUST NOT expose unrestricted raw sensitive data merely to simplify exploration.

## SHOULD
- Repeated ad hoc logic SHOULD be promoted into governed reusable models when business value justifies it.

## Exceptions
Exceptions require documented scope, user population, risk controls, expiration or review date, and approval.

## Verification
Inspect certification metadata, permissions, promotion workflow, usage patterns, and user documentation.