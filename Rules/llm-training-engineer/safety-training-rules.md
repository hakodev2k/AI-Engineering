# Safety Training Rules

## Purpose
Ensure weight updates do not create unacceptable safety regressions or bypass required safeguards.

## Scope
Safety-oriented data, refusal behavior, preference optimization, adversarial training, capability training with safety impact, and release checkpoints.

## MUST
- Safety objectives and protected behaviors MUST be represented in the training and evaluation plan where the model's deployment creates material risk.
- Changes expected to affect refusal, instruction hierarchy, misuse resistance, or sensitive-domain behavior MUST receive targeted evaluation.
- Safety regressions MUST be treated as release blockers unless explicitly accepted by authorized human reviewers.
- Safety data provenance, labeling policy, and mixture contribution MUST be auditable.
- Training intended to improve one safety dimension MUST be checked for displacement into other harmful failure modes.

## MUST NOT
- MUST NOT weaken a safety control merely to improve a headline capability metric without explicit approval and risk analysis.
- MUST NOT infer safety from average helpfulness or loss metrics.
- MUST NOT conceal known unsafe checkpoint behavior behind aggregate scores.

## SHOULD
- Safety training SHOULD include hard negatives and realistic adversarial distributions.
- Evaluation SHOULD test robustness to paraphrase, context changes, and multi-turn pressure.

## Exceptions
Research on unsafe behavior requires containment, restricted access, and documented authorization; it does not authorize deployment.

## Verification
Inspect safety objectives, dataset lineage, mixture weights, targeted evaluations, red-team evidence, regression reports, and approval records.