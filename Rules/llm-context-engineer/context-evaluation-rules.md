# Context Evaluation Rules

## Purpose
Measure whether context improves answer quality, factual support, and task completion rather than relying on intuition.

## Scope
Offline evaluations, retrieval metrics, ablations, human review, and regression testing.

## MUST
- Context changes MUST be evaluated on representative tasks before broad rollout when they can affect production behavior.
- Evaluation MUST separate retrieval quality, context assembly quality, and model response quality where practical.
- Important regressions MUST block release unless explicitly accepted.
- Evaluation datasets MUST include difficult and failure-oriented cases.
- Claims of improvement MUST be supported by before/after evidence.

## MUST NOT
- MUST NOT rely on a small set of handpicked examples as sole evidence.
- MUST NOT optimize only for token count while ignoring answer quality.
- MUST NOT treat model confidence as evaluation evidence.

## SHOULD
- Use ablations to identify which context components contribute value.
- Track both aggregate metrics and important slices.

## Exceptions
Exceptions require documented urgency, risk, and follow-up validation.

## Verification
Inspect evaluation reports, datasets, regression gates, ablations, and reviewer evidence.