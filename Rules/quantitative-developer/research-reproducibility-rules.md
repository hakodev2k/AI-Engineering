# Research Reproducibility Rules

## Purpose
Make quantitative conclusions independently reproducible and auditable.

## Scope
Applies to experiments, notebooks, scripts, datasets, model artifacts, and research reports.

## MUST
- Material research results MUST identify code version, data version or snapshot, parameters, random seeds where relevant, and environment dependencies.
- The path from raw inputs to reported metrics MUST be executable or otherwise reconstructable.
- Randomized methods MUST control and record randomness sufficiently for diagnostic reproduction.
- Manual adjustments that affect results MUST be captured as versioned transformations or explicit research metadata.
- Production candidates MUST be reproducible outside the author's interactive session.

## MUST NOT
- Uncommitted notebook state MUST NOT be the sole source of a production decision.
- Cached intermediate data MUST NOT silently substitute for incompatible current inputs.
- Charts or tables MUST NOT contain transformations absent from the reproducible pipeline.

## SHOULD
- Automate experiment metadata capture and immutable artifact storage.
- Keep exploratory and decision-grade outputs clearly distinguished.

## Exceptions
Exceptions require a documented reason, retained evidence sufficient for independent review, and a plan to restore reproducibility before production use.

## Verification
Re-run representative experiments in a clean environment, compare outputs, inspect dependency locks and data identifiers, and verify reported figures originate from versioned code.