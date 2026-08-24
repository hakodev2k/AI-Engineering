# Container and Runtime
## Purpose
Operate isolated workloads safely on constrained edge hosts.
## Scope
Containers, sandboxes, runtimes, images, and workload privileges.
## MUST
- Images MUST be versioned, reproducible, and integrity-verifiable.
- Runtime privileges, mounts, devices, and capabilities MUST be minimized.
- Resource limits MUST prevent one workload from exhausting shared hosts.
## MUST NOT
- MUST NOT run privileged workloads without explicit technical justification and security review.
- MUST NOT deploy mutable floating image references to production where reproducibility matters.
## SHOULD
- Images SHOULD minimize unused packages and attack surface.
## Exceptions
Hardware-access requirements may justify elevated privileges only with narrowly scoped permissions and documented risk.
## Verification
Inspect manifests, image digests, SBOM/scans, runtime policy, limits, mounts, and privilege settings.