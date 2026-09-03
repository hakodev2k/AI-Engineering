# Dataset Requirements Design

## Purpose
Translate model, product, and evaluation goals into explicit dataset requirements so collection and curation optimize the intended capability instead of merely increasing volume.

## When to use
Use before creating or expanding training, fine-tuning, preference, retrieval, or evaluation datasets, and when a model failure suggests the data specification is wrong.

## Inputs
- Target model/task and users
- Current datasets and model behavior
- Required capabilities and failure tolerances
- Privacy, licensing, cost, compute, and timeline constraints

## Preconditions
The target outcome must be measurable enough to distinguish useful from irrelevant examples.

## Context to inspect
Inspect model architecture and context limits, tokenizer or modality constraints, current data mixture, evaluation slices, production traffic patterns, known failure cases, governance policies, and downstream preprocessing.

## Core knowledge
Data quality is task-relative. Dataset requirements should describe distributions, coverage, provenance, label quality, freshness, diversity, difficulty, contamination controls, and exclusion criteria. More data can worsen performance when it shifts mixture weights or introduces low-quality correlations.

## Procedure
1. Define target capabilities and unacceptable failures.
2. Identify representative user/task distributions.
3. Define required domains, languages, modalities, difficulty bands, and edge cases.
4. Set provenance, licensing, privacy, and freshness constraints.
5. Define quality and deduplication thresholds.
6. Specify label or metadata schema where applicable.
7. Define train, validation, test, and holdout separation rules.
8. Define contamination controls and protected benchmark exclusions.
9. Estimate required volume by slice, not only total count.
10. Define acceptance metrics and review gates.
11. Record unresolved assumptions and validation experiments.

## Decision points
Prefer targeted coverage over indiscriminate scale when failures are localized. Increase diversity when robustness is weak; increase depth when a narrow domain is strategically important. Use synthetic data only when generation quality and leakage controls can be validated.

## Common failure patterns
- Optimizing dataset size instead of task coverage
- Ignoring production distribution
- Vague quality criteria
- Mixing evaluation examples into training
- Neglecting legal or privacy constraints
- Treating all examples as equally valuable

## Verification
The specification is implemented when collection teams can act on it unambiguously. It is verified when sample audits and pilot training show the defined slices correlate with the intended model improvements without unacceptable regressions.

## Expected output
A dataset specification with scope, distributions, constraints, acceptance thresholds, split rules, risks, and measurable success criteria.

## Stop conditions
Stop and escalate if the target task is undefined, required data cannot be lawfully used, protected benchmarks cannot be isolated, or stakeholders disagree on unacceptable failure classes.