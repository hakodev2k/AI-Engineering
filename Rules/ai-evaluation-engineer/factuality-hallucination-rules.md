# Factuality and Hallucination Evaluation Rules

## Purpose
Measure unsupported, incorrect, fabricated, or misleading claims in AI outputs using evidence appropriate to the task.

## Scope
Applies to knowledge responses, summaries, grounded generation, research assistants, extraction, and systems expected to make factual claims.

## MUST
- Factuality evaluation MUST define what source of truth or evidence is authoritative for each task class.
- Unsupported claims MUST be distinguished from explicitly uncertain or appropriately qualified statements.
- Evaluations MUST separate retrieval failure, reasoning failure, citation mismatch, and unsupported generation when those causes are actionable.
- Citation-bearing systems MUST verify that cited sources support the associated claims rather than merely existing.
- High-impact factuality failures MUST be reviewed at claim level, not only by response-level aggregate score.

## MUST NOT
- MUST NOT treat fluent wording as evidence of correctness.
- MUST NOT use the evaluated model's unsupported assertion as its own ground truth.
- MUST NOT count abstention as a factual failure when abstention is the required safe behavior.

## SHOULD
- Dynamic or time-sensitive tasks SHOULD use fresh reference data or clearly bounded knowledge cutoffs.
- Factuality metrics SHOULD report severity as well as frequency where incorrect claims have unequal impact.

## Exceptions
Open-ended creative tasks may exclude factuality scoring when no factual contract is implied; scope boundaries MUST be explicit.

## Verification
Inspect reference sources, claim decomposition logic, citation checks, failure labels, sampled judgments, and evidence that time-sensitive references were current for the evaluated run.