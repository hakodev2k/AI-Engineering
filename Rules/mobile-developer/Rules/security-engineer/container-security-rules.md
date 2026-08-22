# Container Security Rules

## Purpose
Reduce security risk in container images, runtime configuration, and orchestration platforms.

## Scope
Applies to container images, registries, runtime policies, Kubernetes, and containerized workloads.

## MUST
- Images MUST originate from approved sources and be scanned before production use.
- Containers MUST run with the minimum required privileges and capabilities.
- Workload identities and secrets MUST be isolated according to least privilege.
- Base images MUST be maintained and rebuilt when material security fixes become available.
- Production orchestration changes affecting security boundaries MUST be reviewed.

## MUST NOT
- MUST NOT run privileged containers without explicit approved need.
- MUST NOT bake production secrets into container images.
- MUST NOT expose cluster administration endpoints broadly.

## SHOULD
- Prefer read-only filesystems, non-root users, resource limits, admission policies, and network segmentation where compatible.
- Prefer minimal images with only required runtime components.

## Exceptions
Exceptions require documented runtime need, threat analysis, compensating controls, approval, and periodic review.

## Verification
Use image scans, manifest inspection, runtime policy checks, cluster configuration review, admission controls, and penetration testing.