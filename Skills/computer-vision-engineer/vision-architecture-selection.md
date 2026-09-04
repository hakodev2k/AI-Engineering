# Vision Architecture Selection

## Purpose
Select a model family and scale that satisfies quality, latency, memory, data, and maintainability requirements instead of defaulting to the newest architecture.

## When to use
Use at project start, during redesign, or when current quality or serving cost is unacceptable.

## Inputs
Task formulation, dataset scale, target metrics, deployment hardware, latency/throughput limits, memory budget, pretrained model options, and licensing constraints.

## Preconditions
A representative validation set and at least one simple baseline exist or can be built.

## Context to inspect
Inspect input resolution, object scale, temporal requirements, pretrained domain alignment, framework/runtime support, exportability, and operational skill set of the team.

## Core knowledge
CNNs, vision transformers, hybrid backbones, feature pyramids, encoder-decoder models, and foundation vision models trade sample efficiency, global context, compute, memory, and deployment complexity differently. FLOPs alone do not predict latency.

## Procedure
1. Convert product requirements into measurable model constraints.
2. Establish a lightweight baseline.
3. Shortlist architecture families appropriate to the task.
4. Check pretrained weights, licenses, and framework maturity.
5. Compare parameter count, activation memory, input resolution, and expected latency.
6. Train or fine-tune controlled candidate experiments.
7. Evaluate overall and critical-slice quality.
8. Benchmark target hardware, not only development GPUs.
9. Test export/runtime compatibility early.
10. Measure operational complexity and retraining cost.
11. Choose the simplest candidate meeting requirements with margin.
12. Document rejected alternatives and evidence.

## Decision points
Prefer established architectures when reliability and deployment maturity dominate. Use larger foundation backbones when transfer gains justify compute. Increase resolution only when small-detail recall materially benefits.

## Common failure patterns
Selecting by leaderboard alone, ignoring preprocessing cost, benchmarking batch latency while production is batch one, using unsupported operators, and increasing model size to compensate for data defects.

## Verification
Verify reproducible quality comparisons, target-hardware latency/memory, export compatibility, and slice-level acceptance criteria.

## Expected output
An evidence-backed architecture decision with benchmark table, constraints, risks, and fallback options.

## Stop conditions
Stop if candidates cannot be evaluated on representative data/hardware, licensing is unclear, or requirements conflict without stakeholder prioritization.