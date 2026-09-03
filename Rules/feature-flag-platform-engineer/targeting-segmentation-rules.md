# Targeting and Segmentation Rules

## Purpose
Prevent incorrect audience exposure and make targeting decisions reviewable.

## Scope
Applies to user, account, device, tenant, geography, environment, and custom-attribute targeting.

## MUST
- Targeting attributes MUST have documented meaning, source, type, and freshness expectations.
- Sensitive audience changes MUST be reviewed before production activation.
- Segments MUST use stable identifiers appropriate to the intended subject boundary.
- Targeting rules MUST be testable with representative positive and negative contexts.
- Tenant isolation assumptions MUST be explicit when targeting by tenant or organization.

## MUST NOT
- MUST NOT infer authorization from a marketing or experimentation segment.
- MUST NOT use mutable display attributes as durable identity keys when stable identifiers exist.
- MUST NOT expose private targeting criteria to unauthorized clients.

## SHOULD
- Complex reusable audiences SHOULD be defined as named segments with ownership and purpose metadata.

## Exceptions
Emergency targeting changes require post-change review and retained audit evidence.

## Verification
Review segment definitions, sample evaluations, attribute contracts, audit logs, and tenant-boundary tests.