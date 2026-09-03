# Secure Model Serving Rules

## Purpose
Protect production inference services from unauthorized access, abuse, compromise, and unsafe failure modes.

## Scope
Applies to online inference, batch inference, gateways, model servers, accelerators, and serving-side preprocessors.

## MUST
- Authenticate and authorize inference access according to data and model sensitivity.
- Enforce request size, rate, timeout, and resource limits at appropriate boundaries.
- Isolate model-serving workloads from unnecessary filesystem, network, and cloud privileges.
- Validate serving configuration and artifact identity before production startup.
- Define fail-closed or degraded behavior for security-sensitive dependencies.

## MUST NOT
- Expose administrative model-server interfaces publicly without explicit security design.
- Run serving containers with broad host privileges when unnecessary.
- Disable authentication, TLS, or request controls merely to resolve operational friction.

## SHOULD
- Separate public ingress from model runtimes through controlled gateways.
- Use immutable deployment artifacts and read-only filesystems where feasible.

## Exceptions
Any weakened serving control requires bounded duration, compensating controls, documented risk, and human approval.

## Verification
Inspect deployment manifests, IAM, network policy, endpoint tests, resource controls, TLS configuration, and runtime security telemetry.