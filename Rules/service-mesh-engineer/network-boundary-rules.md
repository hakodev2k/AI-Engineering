# Network Boundaries
## Purpose
Align mesh policy with underlying network trust and reachability boundaries.
## Scope
Namespaces, clusters, VPC/VNet boundaries, firewall rules, network policies, and mesh interception.
## MUST
- Mesh security assumptions MUST account for controls below the mesh layer.
- Required control-plane and data-plane ports MUST be explicitly documented and minimized.
- Boundary changes MUST assess bypass paths around mesh enforcement.
## MUST NOT
- MUST NOT assume mTLS replaces all network segmentation requirements.
- MUST NOT open broad network ranges solely to simplify mesh deployment.
- MUST NOT leave known bypass routes undocumented.
## SHOULD
- Defense in depth SHOULD combine workload identity with appropriate network restrictions.
## Exceptions
Broad connectivity requires risk rationale, owner, review, and compensating controls.
## Verification
Review network policy/firewall configuration, packet paths, bypass tests, port inventories, and connectivity probes.