# Model Architecture Rules

## Purpose
Select vision architectures using deployment constraints and evidence rather than novelty alone.

## Scope
Backbones, heads, detectors, segmenters, trackers, transformers, multimodal models, and ensembles.

## MUST
- Architecture selection MUST consider accuracy, latency, memory, throughput, input resolution, hardware, maintainability, and licensing constraints.
- Significant architecture changes MUST document baseline comparison and relevant trade-offs.
- Output semantics and tensor contracts MUST be explicit and versioned where consumed externally.
- Unsupported custom operators MUST have a deployment and fallback strategy before adoption.

## MUST NOT
- Benchmark leadership on unrelated datasets MUST NOT be treated as proof of suitability.
- Architectural complexity MUST NOT be added without measurable benefit or required capability.

## SHOULD
- Simpler architectures SHOULD be preferred when they meet validated requirements with lower operational risk.

## Exceptions
Research prototypes may relax deployment constraints if clearly isolated from production claims.

## Verification
Review design records, benchmark matrices, exported model contracts, hardware tests, dependency licenses, and baseline comparisons.