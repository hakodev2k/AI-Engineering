# Image Data Generation

## Purpose
Create synthetic image datasets that expand visual coverage while preserving task relevance, annotation quality, privacy, and domain realism.

## When to use
Use for rare visual conditions, privacy-sensitive imagery, domain adaptation, defect generation, edge cases, controlled backgrounds, or evaluation scenarios unavailable in sufficient real data.

## Inputs
Target vision task, image specifications, labels, scene constraints, reference statistics, generation model or simulator, annotation schema, quality thresholds.

## Preconditions
Rights and privacy constraints for any source or conditioning images are known. The downstream task has an independent real validation set.

## Context to inspect
Resolution, sensor characteristics, lighting, viewpoint, class prevalence, backgrounds, occlusion, artifacts, annotation definitions, production camera/domain conditions.

## Core knowledge
Photorealism is not equivalent to task fidelity. Synthetic images can contain texture artifacts, unrealistic geometry, generator shortcuts, inconsistent labels, or domain gaps that models exploit.

## Procedure
1. Define task-critical visual factors and edge cases.
2. Choose simulation, procedural rendering, diffusion/generative models, compositing, or hybrid generation.
3. Control class, pose, environment, lighting, occlusion, and difficulty distributions.
4. Record generation parameters and provenance.
5. Produce annotations from simulator state or validated labeling workflows.
6. Detect rendering/generation artifacts and duplicate scenes.
7. Compare feature and scenario distributions with real data.
8. Train or evaluate downstream vision models using controlled mixes.
9. Measure performance on independent real-world validation sets.
10. Iterate on gaps revealed by error analysis.

## Decision points
Prefer simulators when physical state and exact labels matter; generative models when appearance diversity dominates; combine them when semantic correctness and realism both matter.

## Common failure patterns
Optimizing FID-like metrics alone, unrealistic shadows or geometry, label-image mismatch, overusing one generator, and training on synthetic artifacts absent in production.

## Verification
Check annotation consistency, artifact rates, coverage targets, domain similarity, and real-world downstream performance.

## Expected output
A reproducible image-generation pipeline, versioned dataset, and task-specific validation report.

## Stop conditions
Stop when generated imagery violates rights/privacy constraints, labels cannot be trusted, or real-world performance degrades materially.