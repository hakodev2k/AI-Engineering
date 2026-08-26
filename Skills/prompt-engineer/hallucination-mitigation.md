# Hallucination Mitigation

## Purpose
Reduce unsupported factual claims by aligning prompt behavior with available evidence and uncertainty.

## When to use
Use for factual QA, RAG, research, extraction, support, or any workflow where invented facts cause harm.

## Inputs
Authoritative sources, context pipeline, task contract, citation requirements, known hallucination cases, and evals.

## Context to inspect
Determine what evidence is actually available at inference time and whether retrieval supplies the facts the prompt expects.

## Core knowledge
Prompting can encourage evidence discipline but cannot manufacture missing knowledge or guarantee truth. Faithfulness, factual correctness, and completeness are distinct.

## Procedure
1. Define which claims require supplied evidence.
2. Identify authoritative sources and freshness requirements.
3. Instruct the model to distinguish evidence from inference.
4. Define behavior when evidence is missing or contradictory.
5. Require citations/attribution when the product can validate them.
6. Avoid asking for unsupported specificity.
7. Improve retrieval before adding increasingly forceful wording.
8. Test answerable, unanswerable, ambiguous, and conflicting-source cases.
9. Validate citations against source content programmatically where possible.
10. Track unsupported-claim rate in evaluation and production review.

## Decision points
Use abstention when correctness matters more than coverage. Use qualified inference when the product explicitly permits analysis and labels it clearly.

## Common failure patterns
“Never hallucinate” as the only control; fabricated citations; forcing an answer; treating model confidence language as calibrated probability; evaluating only answerable questions.

## Verification
Measure factual correctness, evidence faithfulness, citation validity, and appropriate abstention on held-out cases.

## Expected output
Evidence-use rules, uncertainty behavior, evaluation cases, and measured hallucination reduction.

## Stop conditions
Stop when required facts are unavailable, source authority is disputed, or the workflow requires guarantees beyond probabilistic model capability.