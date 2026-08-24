# Cost and Capacity

## Purpose
Prevent infrastructure-as-code changes from causing unjustified spend, quota exhaustion, or insufficient capacity.

## Scope
Resource sizing, counts, regions, data transfer, storage, reservations, quotas, and autoscaling-related infrastructure.

## MUST
- Material cost-impacting changes MUST include an estimate or equivalent evidence before approval.
- Capacity-sensitive changes MUST consider quotas, regional availability, and peak requirements.
- Large scale-out changes MUST identify rollback or containment options.
- Cost ownership metadata MUST be applied where organizational standards require it.

## MUST NOT
- Cost reductions MUST NOT compromise required reliability, security, retention, or recovery objectives without explicit trade-off approval.
- `count`/`for_each` changes with large cardinality impact MUST NOT be applied without reviewing resulting resource counts.
- Temporary expensive resources MUST NOT be left without ownership and cleanup criteria.

## SHOULD
- Plans SHOULD be supplemented by cost estimation for meaningful changes.
- Rightsizing decisions SHOULD use utilization and demand evidence.

## Exceptions
Urgent capacity expansion may precede optimization but requires approval, monitoring, and a follow-up review.

## Verification
Inspect plan resource counts, cost estimates, quotas, utilization metrics, architecture requirements, tags/labels, and post-deployment billing/capacity signals.