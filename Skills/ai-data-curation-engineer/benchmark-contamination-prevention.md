# Benchmark Contamination Prevention

## Purpose
Prevent protected evaluation content and close variants from entering training data so reported model quality reflects generalization rather than memorization.

## When to use
Use before training or fine-tuning when public benchmarks, internal evals, challenge sets, or future holdouts may overlap acquired data.

## Inputs
Training candidates, protected evaluation corpora, benchmark metadata, normalization rules, similarity methods, and contamination thresholds.

## Context to inspect
Inspect source dates, benchmark publication history, derived variants, prompts and answers separately, multilingual translations, synthetic paraphrases, and prior deduplication logic.

## Core knowledge
Contamination includes exact copies, partial excerpts, paraphrases, answer leakage, translated variants, and benchmark-derived tutorials. Detection requires task-aware matching; aggressive removal can also erase legitimate domain knowledge.

## Procedure
1. Build a governed registry of protected evaluations.
2. Normalize comparison representations without destroying meaningful structure.
3. Run exact hash and substring matching.
4. Add n-gram or approximate lexical matching.
5. Add semantic similarity for high-risk benchmarks.
6. Inspect candidate clusters near thresholds.
7. Exclude contaminated records and record reasons.
8. Propagate exclusions through derived datasets.
9. Re-run checks after merges, synthetic generation, or relabeling.
10. Produce contamination metrics for each release.

## Decision points
Apply stricter thresholds to canonical benchmark questions and answers than to broad background knowledge. For ambiguous overlap, quarantine for review rather than silently retaining it. Preserve independent clean holdouts where feasible.

## Common failure patterns
- Checking exact strings only
- Protecting questions but not answers
- Ignoring translated or paraphrased copies
- Running checks once before later dataset merges
- Treating public benchmark discussion pages as harmless

## Verification
Implemented means protected corpora are automatically checked. Verified means seeded contamination is reliably detected and sampled near-matches show acceptable precision while release manifests document exclusions.

## Expected output
A contamination report, exclusion manifest, protected-eval registry version, thresholds, and review evidence.

## Stop conditions
Stop when protected evaluation material is unavailable for checking, matching quality is unvalidated, or contamination cannot be separated from required training data without an explicit approval decision.