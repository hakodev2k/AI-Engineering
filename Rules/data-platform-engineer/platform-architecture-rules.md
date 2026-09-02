# Platform Architecture Rules

## Purpose
Define durable architectural constraints for shared data platforms so teams can evolve capabilities without creating hidden coupling, unsafe ownership, or operational fragility.

## Scope
Applies to data platform services, shared ingestion and processing infrastructure, storage layers, orchestration, metadata services, and platform interfaces.

## MUST
- Platform architecture MUST be derived from documented workload, availability, consistency, security, governance, latency, throughput, and cost requirements.
- Every shared platform capability MUST have a clearly defined owner, service boundary, supported contract, and operational responsibility.
- Architecture decisions with material long-term impact MUST record constraints, alternatives, failure modes, migration implications, and reversibility.
- Control-plane and data-plane responsibilities MUST be separated when their failure or security characteristics differ materially.
- Critical dependencies MUST have explicit timeout, retry, degradation, and recovery behavior.

## MUST NOT
- MUST NOT introduce a shared component solely to reduce local duplication when it creates stronger cross-team coupling or an unclear ownership boundary.
- MUST NOT claim scalability, durability, consistency, or availability guarantees that are not supported by tested platform behavior.
- MUST NOT create a platform-wide single point of failure without a documented, accepted risk and recovery strategy.

## SHOULD
- Prefer composable platform primitives over narrowly tailored one-off workflows.
- Prefer reversible architecture decisions when requirements remain uncertain.
- Keep the platform as simple as possible while satisfying proven requirements.

## Exceptions
Exceptions require documented context, evidence, alternatives considered, operational and security risk, rollback strategy, and approval by accountable technical owners.

## Verification
Review architecture decision records, service boundaries, dependency diagrams, failure-mode tests, SLOs, and production telemetry against stated guarantees.