# Data Mixture Design

## Purpose
Design and validate the composition of training data so model capability reflects deliberate priorities rather than accidental corpus volume.

## When to use
Use for pretraining, continued pretraining, domain adaptation, multilingual training, and mixture revisions.

## Inputs
Candidate datasets, token counts, quality signals, domains, languages, licenses, duplication statistics, target capabilities, baseline mixture and evaluation results.

## Context to inspect
Dataset lineage, sampling implementation, tokenizer behavior, contamination checks, domain imbalance, prior ablations, and downstream evaluation slices.

## Core knowledge
Mixture weights interact with dataset quality, repetition, tokenization efficiency, curriculum, model scale, and training duration. More tokens from a domain do not guarantee better generalization. Repeated small corpora can overfit and amplify memorization.

## Procedure
1. Inventory sources and provenance.
2. Quantify usable tokens after filtering and deduplication.
3. Group sources by capability-relevant domain and risk.
4. Establish a defensible baseline mixture.
5. Set sampling weights and effective epoch counts.
6. Check whether small datasets will be excessively repeated.
7. Run small-scale mixture ablations when uncertainty is material.
8. Measure capability and regression slices, not only aggregate loss.
9. Document rationale and exact mixture configuration.
10. Recompute realized mixture from training logs to detect sampler drift.

## Decision points
Upsample scarce high-value data only when repetition risk is controlled. Prefer higher-quality subsets over indiscriminate volume when marginal data is noisy. Use staged mixtures when late-training specialization is demonstrably beneficial.

## Common failure patterns
Weights based only on raw size; hidden duplicate sources; accidental language collapse; excessive repetition; evaluation contamination; sampler configuration differing from the design document.

## Verification
Reconstruct sampled token proportions from logs, compare them with planned weights, and confirm targeted evaluation gains without unacceptable regressions or memorization signals.

## Expected output
A versioned mixture specification with provenance, weights, effective epochs, rationale, and validation evidence.

## Stop conditions
Stop for unresolved licensing/provenance, suspected protected-set leakage, unexplained sampler mismatch, or severe slice regressions.