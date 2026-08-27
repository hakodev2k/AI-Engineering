# Rate Limiting Rules

## Purpose
Control abusive or excessive request rates while preserving predictable service for legitimate consumers.

## Scope
Applies to per-client, tenant, token, endpoint, and global API rate controls.

## MUST
- Rate-limit identity, scope, window or algorithm, quota, and enforcement point MUST be explicit.
- Limits MUST account for shared-resource fairness and critical endpoint cost.
- Rejections MUST use documented protocol semantics and expose actionable retry information where safe.
- Limit changes with material consumer impact MUST be reviewed as contract changes.
- Distributed enforcement MUST define consistency behavior and acceptable overshoot.

## MUST NOT
- MUST NOT key security-sensitive limits solely on easily spoofed attributes.
- MUST NOT leak sensitive tenant or capacity information through rate-limit metadata.
- MUST NOT disable limits during incidents without evaluating overload consequences.

## SHOULD
- Separate burst and sustained-rate controls SHOULD be used when traffic patterns require both.
- High-cost operations SHOULD have cost-aware limits rather than request-count parity.

## Exceptions
Exceptions require consumer need, capacity evidence, duration, blast-radius analysis, owner, and approval.

## Verification
Inspect gateway/service configuration, distributed limiter behavior, abuse tests, load tests, response headers, dashboards, and tenant-fairness metrics.