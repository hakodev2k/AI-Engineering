# Object Storage Rules

## Purpose
Operate object storage safely across namespace, lifecycle, consistency, durability, and access concerns.

## Scope
Buckets/containers, objects, versioning, lifecycle, multipart operations, metadata, and API semantics.

## MUST
- Object naming, versioning, retention, and lifecycle policies MUST reflect application and compliance requirements.
- Consistency and overwrite/delete semantics MUST be understood before application integration.
- Large-scale lifecycle or deletion policies MUST be tested on bounded scope before broad activation.
- Critical object inventories MUST have a recovery or reconstruction strategy.

## MUST NOT
- MUST NOT enable public access unintentionally.
- MUST NOT apply destructive lifecycle rules to production data without preview, scope verification, and approval.
- MUST NOT assume object listings are a complete authoritative inventory unless service semantics guarantee it.

## SHOULD
- Use versioning or immutability where accidental or malicious deletion risk justifies it.

## Exceptions
Cost-driven reductions in protection require data-owner approval and documented recoverability impact.

## Verification
Inspect bucket policies, lifecycle rules, versioning, retention controls, API tests, and sampled inventory results.