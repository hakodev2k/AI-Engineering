# Data Plane
## Purpose
Keep proxies and traffic interception reliable, compatible, and resource-safe.
## Scope
Sidecars, ambient data planes, gateways, interception, proxy lifecycle, and configuration.
## MUST
- Data-plane resource requests and limits MUST be based on observed traffic and proxy behavior.
- Proxy readiness MUST prevent traffic before required configuration is usable.
- Version compatibility with the control plane MUST be maintained during upgrades.
## MUST NOT
- MUST NOT bypass the data plane silently for traffic expected to be governed by mesh policy.
- MUST NOT apply global proxy tuning without workload impact analysis.
- MUST NOT ignore proxy crash or restart trends.
## SHOULD
- Data-plane overhead SHOULD be measured separately from application resource use.
## Exceptions
Bypass exceptions require documented traffic scope, security impact, and expiry.
## Verification
Inspect interception paths, proxy config, resource telemetry, restart rates, readiness behavior, and version inventory.