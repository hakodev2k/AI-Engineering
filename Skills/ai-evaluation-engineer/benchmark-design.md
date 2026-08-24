# Benchmark Design

## Purpose
Create benchmarks that measure real system capability and failure behavior rather than rewarding memorization, leakage, or narrow prompt-specific optimization.

## When to use
Use when creating a new eval set, replacing weak public benchmarks, measuring a new capability, or diagnosing why benchmark gains do not translate to product gains.

## Inputs
- Capability definition
- User tasks and production examples
- Candidate benchmark items
- Model/system versions
- Known failure modes

## Context to inspect
Inspect data provenance, item difficulty, task distribution, contamination risk, label quality, production traffic mix, and benchmark history.

## Core knowledge
Good benchmarks require construct validity, representative coverage, stable scoring, contamination controls, challenge cases, and versioning. A benchmark should be difficult enough to discriminate systems without becoming an artificial puzzle set.

## Procedure
1. Define the capability or behavior the benchmark is intended to measure.
2. Identify realistic task families and failure categories.
3. Source examples from production, domain experts, controlled synthesis, or public data with provenance recorded.
4. Remove duplicates, near-duplicates, leaked answers, and ambiguous cases.
5. Create balanced slices across difficulty, domain, language, format, and risk where relevant.
6. Define deterministic or rubric-based scoring for each item type.
7. Pilot the benchmark against multiple system versions and known baselines.
8. Check whether scores discriminate meaningful system differences.
9. Review false positives and false negatives with domain experts.
10. Freeze and version the benchmark before comparing release candidates.

## Decision points
Use production-derived items for realism, synthetic items for controlled edge coverage, and public benchmarks mainly for external comparability. Keep hidden holdouts when repeated optimization could cause benchmark overfitting.

## Common failure patterns
- Overfitting to one prompt format
- Including impossible or ambiguous tasks
- Benchmark leakage into training or tuning data
- Excessive synthetic homogeneity
- Reusing a benchmark indefinitely after saturation

## Verification
Verify item provenance, scoring reproducibility, slice coverage, baseline discrimination, and that a deliberately degraded system scores worse on the intended dimensions.

## Expected output
A versioned benchmark with documented scope, provenance, scoring rules, slices, baselines, and limitations.

## Stop conditions
Stop when contamination cannot be assessed, scoring is materially subjective without a rubric, or benchmark items cannot be tied to the claimed capability.