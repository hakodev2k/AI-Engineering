# Labeling and Ground Truth Rules

## Purpose
Ensure synthetic labels are trustworthy, traceable, and appropriate for training or evaluation claims.

## Scope
Applies to generated class labels, annotations, scores, outcomes, bounding regions, structured targets, preference labels, and scenario truth.

## MUST
- Define how each label is produced and what evidence makes it valid.
- Separate labels derived from deterministic simulation truth from labels inferred by another model or heuristic.
- Measure label accuracy independently when labels are generated probabilistically or by an imperfect teacher.
- Preserve uncertainty when the underlying task is ambiguous rather than fabricating false certainty.
- Validate label consistency with generated inputs and domain constraints.
- Mark weak, inferred, or model-generated labels so downstream consumers can distinguish them from authoritative ground truth.

## MUST NOT
- Present teacher-model outputs as ground truth without qualification and validation.
- Use circular evaluation where the same model family generates and judges labels without independent evidence.
- Correct labels manually without preserving audit history.
- Hide known label noise when reporting downstream performance.

## SHOULD
- Use multiple independent labeling signals for high-risk tasks.
- Maintain gold validation subsets reviewed by trusted experts where feasible.
- Quantify label uncertainty and disagreement.

## Exceptions
Alternative labeling approaches require documented accuracy evidence, limitations, downstream impact, and approval appropriate to risk.

## Verification
Review label-generation logic, provenance, agreement studies, gold-set comparisons, uncertainty metrics, and audits of input-label semantic consistency.