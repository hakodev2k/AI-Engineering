# GPU Architecture Rules

## Purpose
Ensure GPU system decisions reflect the actual execution, memory, and interconnect characteristics of the target hardware.

## Scope
Applies to GPU architecture selection, workload mapping, kernel design constraints, and platform reviews.

## MUST
- Target hardware capabilities MUST be identified before architecture-specific optimization is approved.
- Decisions MUST account for compute throughput, memory capacity/bandwidth, synchronization, and host-device transfer costs.
- Hardware-specific assumptions MUST be documented when they affect correctness, portability, or capacity.
- Architecture changes MUST include evidence from representative workloads.

## MUST NOT
- MUST NOT assume peak specification throughput is achievable application throughput.
- MUST NOT depend on undocumented hardware behavior for correctness.
- MUST NOT introduce hardware lock-in without documenting portability and lifecycle impact.

## SHOULD
- Prefer designs that preserve a portable baseline while isolating architecture-specific fast paths.
- Evaluate generation-to-generation behavior before fleet-wide upgrades.

## Exceptions
Exceptions require documented workload constraints, measured benefit, portability risk, fallback behavior, and reviewer approval.

## Verification
Review hardware capability queries, profiling traces, benchmarks, compatibility tests, and architecture decision records.