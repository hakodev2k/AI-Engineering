# Benchmark Contamination and Leakage

## Purpose
Detect and reduce benchmark contamination, answer leakage, and evaluation overfitting that can make a system appear better without improving real capability.

## When to use
Use when public benchmarks are involved, when benchmark scores improve suspiciously fast, when evaluation examples influence prompt tuning or fine-tuning, or before making capability claims.

## Inputs
- Benchmark items and provenance
- Training/tuning data information when available
- Prompt and development history
- Candidate outputs
- Public benchmark exposure information

## Context to inspect
Inspect whether examples, references, rubrics, or close paraphrases were visible during training, fine-tuning, prompt development, retrieval indexing, or manual optimization.

## Core knowledge
Contamination can occur through pretraining, fine-tuning, retrieval corpora, prompt examples, developer inspection, or repeated benchmark-specific optimization. Exact-match detection alone is insufficient; semantic near-duplicates and recognizable templates also matter.

## Procedure
1. Record provenance and publication history for benchmark items.
2. Separate public, developer-visible, and hidden holdout items.
3. Search accessible training/tuning/retrieval corpora for exact and near-duplicate content where possible.
4. Check prompts, few-shot examples, and development notes for benchmark leakage.
5. Compare performance on visible versus hidden or newly authored items.
6. Create paraphrased and structurally novel variants to test memorization sensitivity.
7. Investigate suspiciously high performance with brittle transfer to related tasks.
8. Rotate or refresh holdouts when repeated optimization pressure is high.
9. Restrict access to high-value hidden sets and audit exposure.
10. Document residual contamination uncertainty in reported results.

## Decision points
Use public benchmarks for comparability but not as sole release evidence. Prefer fresh hidden sets for high-stakes internal decisions. Do not discard a benchmark merely because exposure is possible; qualify what the score can validly claim.

## Common failure patterns
- Assuming no exact duplicates means no contamination
- Fine-tuning on eval failures and reusing the same test set
- Putting benchmark answers in retrieval indexes
- Repeated manual prompt tuning against hidden labels
- Publishing capability claims without provenance caveats

## Verification
Verify access controls, dataset lineage, duplicate-search results, and generalization to fresh unseen items that measure the same capability.

## Expected output
A contamination assessment with exposure paths, evidence, mitigations, holdout policy, and limitations on score interpretation.

## Stop conditions
Stop when provenance is unknowable and the benchmark is being used for consequential claims without independent fresh evidence.