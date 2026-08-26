# Training Infrastructure

## Purpose
Make model training reproducible, isolated, observable, and safe at scale.

## Scope
Training jobs, distributed compute, accelerators, schedulers, and runtime environments.

## MUST
- Training jobs MUST declare resource requirements, immutable code/version inputs, and durable output locations.
- Distributed jobs MUST define timeout, failure, retry, and checkpoint behavior.
- Resource quotas and tenant isolation MUST be enforced for shared clusters.

## MUST NOT
- Training workloads MUST NOT rely on mutable local state as the sole copy of valuable artifacts.
- Failed workers MUST NOT be retried indefinitely without bounded policy and diagnostics.

## SHOULD
- Jobs SHOULD be preemptible when checkpointing and workload economics permit.
- Runtime images SHOULD be pinned and reproducibly built.

## Exceptions
Nonstandard runtimes require rationale, security review, ownership, and reproducibility evidence.

## Verification
Inspect job specifications, scheduler policy, image digests, checkpoint recovery tests, quota configuration, logs, and distributed failure tests.