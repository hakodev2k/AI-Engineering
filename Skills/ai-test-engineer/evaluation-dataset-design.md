# Evaluation Dataset Design

## Purpose
Create representative, versioned evaluation datasets for AI systems so quality and regression claims are based on realistic, traceable evidence.

## When to use
Use when establishing baselines, release gates, model comparisons, prompt changes, retrieval changes, or regression suites.

## Inputs
Target tasks, user segments, historical examples, incidents, domain taxonomy, expected outputs, risk categories, and privacy constraints.

## Preconditions
The intended product behavior and important user populations are defined.

## Context to inspect
Review production distributions, support cases, benchmark data, model failure reports, policy constraints, and data lineage.

## Core knowledge
An evaluation set should represent task diversity, risk diversity, difficulty, edge cases, and important subgroups. It must avoid test contamination and should distinguish curated gold data from naturally sampled production data.

## Procedure
1. Define the evaluation objective and unit of analysis.
2. Build a taxonomy of normal, difficult, edge, and adversarial cases.
3. Sample or author cases across user/task distributions.
4. Add known historical failures and high-severity scenarios.
5. Define labels, rubrics, reference answers, or acceptance criteria.
6. Track provenance and licensing/privacy constraints.
7. Remove duplicates and obvious contamination.
8. Partition development and held-out sets.
9. Version cases and metadata.
10. Review subgroup coverage and blind spots.
11. Pilot the set against a baseline system and inspect score distributions.

## Decision points
Use real production samples when fidelity matters and privacy allows. Use synthetic generation to fill rare coverage gaps, but validate synthetic examples with domain experts. Prefer held-out cases for release decisions.

## Common failure patterns
Benchmark-only testing, overrepresenting easy cases, leaking test examples into prompt tuning, unclear labels, weak provenance, and allowing one dominant category to hide regressions elsewhere.

## Verification
Confirm category coverage, provenance, deduplication, versioning, and held-out separation. Run inter-reviewer checks when subjective labels are used.

## Expected output
A documented, versioned evaluation dataset with taxonomy, metadata, provenance, labels or rubrics, and coverage report.

## Stop conditions
Stop when data rights are unclear, sensitive data lacks approval, or target behavior is too ambiguous to label consistently.