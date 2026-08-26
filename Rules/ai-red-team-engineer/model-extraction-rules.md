# Model Extraction and Inference

## Purpose
Evaluate exposure of proprietary model behavior, training signals, and sensitive membership information.

## Scope
Public and authenticated inference interfaces, embeddings, logits, confidence data, fine-tuned behavior, and rate controls.

## MUST
- Define what information is considered protected before extraction testing.
- Measure whether attack success exceeds an appropriate baseline.
- Test controls such as rate limits, output minimization, and anomaly detection where relevant.

## MUST NOT
- Claim extraction or membership inference from anecdotal similarity alone.
- Conduct high-volume probing outside authorized budgets or rate limits.

## SHOULD
Use statistically defensible evaluation and separate memorization evidence from generalization.

## Exceptions
Expanded query budgets require explicit approval and resource-impact assessment.

## Verification
Review datasets, baselines, query counts, statistical results, interface configuration, and detection telemetry.