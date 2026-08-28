# Training Cluster Rules

## Purpose
Ensure large-scale training clusters are reliable, reproducible, and operationally safe.

## Scope
Applies to distributed training clusters, node pools, accelerators, networking, storage, orchestration, and maintenance.

## MUST
- Training clusters MUST define supported hardware, drivers, runtimes, and orchestration versions.
- Multi-node training MUST validate topology, collective communication, and failure recovery before production use.
- Maintenance procedures MUST define workload drain, checkpoint protection, and rollback.
- Cluster changes affecting distributed communication MUST be load-tested at representative scale.

## MUST NOT
- MUST NOT mix incompatible driver or runtime versions within a production training pool without validated compatibility.
- MUST NOT perform disruptive cluster maintenance without checking active high-cost jobs.
- MUST NOT rely on node replacement as the only recovery mechanism for jobs that cannot resume.

## SHOULD
- Cluster images SHOULD be immutable and versioned.
- Fault domains SHOULD be visible to placement and scheduling systems.

## Exceptions
Exceptions require compatibility evidence, workload owner review, and a bounded rollback plan.

## Verification
Inspect cluster manifests, node images, version inventories, distributed tests, maintenance records, and checkpoint recovery evidence.