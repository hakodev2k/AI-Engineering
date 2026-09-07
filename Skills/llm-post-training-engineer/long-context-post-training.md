# Long-Context Post-Training

## Purpose
Improve reliable behavior on long inputs by teaching retrieval, instruction retention, evidence use, and position robustness without assuming that a larger context window automatically yields useful long-context capability.

## When to use
Use when the deployed model must analyze long documents, conversations, codebases, or retrieved evidence and shows lost constraints, position bias, distractor sensitivity, or unsupported synthesis.

## Inputs
Long-context task distribution, context-length targets, base checkpoint, long examples, retrieval/evidence annotations, serving limits, and long-context evaluations.

## Preconditions
The model/runtime supports the intended context length, positional configuration is compatible, and evaluation can distinguish genuine evidence use from memorized answers.

## Context to inspect
Inspect position encoding/scaling, tokenizer behavior, training-length distribution, packing, truncation, attention implementation, serving memory limits, prompt structure, and evidence locations.

## Core knowledge
Long-context success depends on both architecture/runtime support and learned behavior. Models can exhibit primacy/recency bias, distractor capture, instruction forgetting, and answer-from-prior behavior despite nominal context capacity. Training must vary evidence position and distractors. Length generalization should be measured across multiple lengths, not only maximum-length examples.

## Procedure
1. Baseline retrieval and reasoning accuracy across increasing context lengths.
2. Categorize failures into retrieval, instruction retention, evidence integration, and computation.
3. Construct examples with answer-relevant evidence at varied positions.
4. Add plausible distractors and conflicting but lower-authority text.
5. Include tasks requiring multiple distant evidence pieces.
6. Train on a distribution of lengths rather than only maximum-length sequences.
7. Monitor memory, throughput, truncation, and packing behavior during training.
8. Evaluate position robustness using controlled evidence relocation.
9. Test abstention when required evidence is absent.
10. Measure citation/evidence faithfulness where the application needs grounded answers.
11. Compare tuning against retrieval or chunking solutions on cost and quality.
12. Test serving with the exact attention kernels and context settings used in production.

## Decision points
Use retrieval/chunking when only a small portion of a large corpus is relevant; use long-context tuning when cross-document/global context matters. Increase context length only when marginal task quality justifies training and serving cost. Prefer architectural/runtime fixes when failures stem from unsupported positional scaling.

## Common failure patterns
Training-serving length mismatch; evidence always near the end; synthetic distractors that are unrealistically easy; hidden truncation; high nominal context with poor effective recall; large latency increases for minimal quality gains.

## Verification
Measure accuracy by context length and evidence position, distractor robustness, missing-evidence abstention, throughput/memory, and preservation on short-context tasks. Re-run with production serving settings.

## Expected output
A long-context-capable checkpoint with length/position curves, serving-cost analysis, evidence-use evaluation, and supported context envelope.

## Stop conditions
Stop if infrastructure cannot faithfully serve the trained context regime, gains disappear under production kernels, truncation invalidates examples, or retrieval provides equivalent quality at substantially lower risk/cost.