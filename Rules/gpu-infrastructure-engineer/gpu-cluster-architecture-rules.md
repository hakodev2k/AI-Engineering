# GPU Cluster Architecture Rules

## Purpose
Define Senior-level architecture rules for production GPU infrastructure so compute, networking, storage, scheduling, and failure domains are deliberate and evolvable.

## Scope
Applies to shared GPU clusters used for training, inference, batch acceleration, and interactive development.

## MUST
- Cluster architecture MUST document workload classes, accelerator types, expected scale, topology constraints, availability targets, and operational ownership.
- Failure domains MUST be explicit across hosts, racks, zones, networks, storage paths, and control-plane dependencies.
- GPU, CPU, memory, network, and storage ratios MUST be sized from workload evidence rather than accelerator count alone.
- Architecture changes with material capacity, compatibility, or availability impact MUST include rollback or containment plans.
- Control-plane and data-plane dependencies MUST be separately observable.

## MUST NOT
- A cluster MUST NOT assume all GPU models, interconnects, or host generations are performance-equivalent.
- Critical shared infrastructure MUST NOT depend on a single undocumented component or administrative path.
- Production architecture MUST NOT rely on scheduler behavior that has not been validated under representative contention.

## SHOULD
- Pools SHOULD be segmented when workload isolation, hardware generation, locality, or maintenance policy materially differs.
- Architecture SHOULD preserve the ability to add new accelerator generations without forcing a fleet-wide migration.

## Exceptions
Exceptions require documented constraints, risk, alternatives considered, validation evidence, and technical-owner approval when reliability or isolation is weakened.

## Verification
Review architecture diagrams, capacity models, topology inventories, failure-mode tests, scheduler configuration, dependency maps, and production telemetry.