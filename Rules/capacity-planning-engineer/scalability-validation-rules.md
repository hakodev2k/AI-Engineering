# Scalability Validation Rules
## Purpose
Verify systems scale as assumed before capacity commitments depend on them.
## Scope
Horizontal scaling, vertical scaling, sharding, partitioning, autoscaling, and dependency scaling.
## MUST
- Material scaling assumptions MUST be validated under representative load before they are used for high-risk plans.
- Tests MUST measure throughput, latency, errors, saturation, and resource efficiency across scale points.
- Scaling limits and degradation modes MUST be documented.
## MUST NOT
- MUST NOT assume adding replicas produces proportional throughput.
- MUST NOT ignore coordination, partition, cache, or database constraints.
## SHOULD
- Validation SHOULD include scale-up and scale-down behavior.
## Exceptions
Production-only validation requires explicit risk controls and approval.
## Verification
Inspect load-test artifacts, scale curves, telemetry, and documented limits.