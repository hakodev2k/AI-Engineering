# Upgrade and Version Skew Rules
## Purpose
Upgrade Kubernetes and platform components without unsupported combinations or avoidable outages.
## Scope
Control plane, nodes, APIs, CNI, CSI, ingress, operators, add-ons, and client compatibility.
## MUST
- Review supported version-skew and compatibility matrices before upgrades.
- Detect deprecated or removed APIs before advancing cluster versions.
- Test representative workloads and platform add-ons against the target version.
- Define rollback or forward-recovery strategy and maintenance risk before production execution.
## MUST NOT
- Upgrade production solely because a new version is available.
- Ignore unsupported add-on, API, or node compatibility.
## SHOULD
- Upgrade incrementally and observe objective health signals between stages.
## Exceptions
Urgent security upgrades may accelerate normal validation with explicit risk approval and enhanced monitoring.
## Verification
Inspect compatibility evidence, deprecation scans, test results, staged upgrade records, health metrics, and support status.