# Vision Problem Formulation

## Purpose
Translate an ambiguous visual problem into a measurable computer-vision task with explicit objectives, constraints, data requirements, and production success criteria.

## When to use
Use when scoping a new vision feature, replacing heuristics, or reviewing a project whose model metric does not align with business value. Do not start model selection before this formulation is stable.

## Inputs
- Product or operational requirement
- Example images/video and labels if available
- Error costs and safety constraints
- Latency, throughput, compute, privacy, and deployment limits
- Existing baseline behavior

## Preconditions
A domain owner can explain the real decision or workflow affected by model output.

## Context to inspect
Inspect image sources, capture conditions, label semantics, downstream consumers, edge cases, geography/device variation, and whether ground truth can be obtained reliably.

## Core knowledge
Classification, detection, segmentation, keypoint estimation, tracking, retrieval, OCR, and multimodal tasks impose different annotation and inference costs. Dataset representativeness and error economics often matter more than architecture novelty.

## Procedure
1. Define the user or system decision enabled by vision output.
2. Convert that decision into a precise prediction task.
3. Define the unit of prediction and expected output schema.
4. Identify required spatial, temporal, or textual context.
5. Enumerate high-cost false positives and false negatives.
6. Specify operating conditions and out-of-distribution cases.
7. Define data and annotation requirements.
8. Establish non-ML or simple-model baselines.
9. Select offline metrics tied to the actual decision threshold.
10. Define production SLOs for quality, latency, throughput, and availability.
11. Record assumptions, risks, and unresolved dependencies.
12. Review formulation with domain, product, safety, and operations stakeholders.

## Decision points
Choose detection over classification when localization matters; segmentation when pixel-level geometry affects the decision; tracking when identity across time matters. Prefer simpler methods if they meet requirements with lower operational risk.

## Common failure patterns
Label definitions that shift during training, optimizing aggregate accuracy while rare costly errors dominate, training on curated imagery unlike production, and ignoring camera or device constraints.

## Verification
The formulation is verified when examples can be unambiguously mapped to outputs, baseline and target metrics are defined, operational constraints are measurable, and stakeholders agree on failure costs.

## Expected output
A concise task specification covering prediction target, data, metrics, constraints, baselines, risks, and acceptance criteria.

## Stop conditions
Stop if ground truth cannot be defined, required visual evidence is unavailable, safety requirements are unresolved, or a simpler non-ML solution already satisfies the need.