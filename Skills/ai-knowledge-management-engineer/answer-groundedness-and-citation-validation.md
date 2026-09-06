# Answer Groundedness and Citation Validation

## Purpose
Verify that AI answers are supported by retrieved knowledge and that citations point to evidence that actually substantiates the claims made.

## When to use
Use for RAG quality assurance, release gates, incident analysis, or when users report plausible but unsupported answers.

## Inputs
Generated answers, retrieved context, citation mappings, source authority, claim-level evaluation rules, and expected abstention behavior.

## Context to inspect
Inspect prompt instructions, context assembly, claim extraction, citation IDs, source chunks, answer traces, and known hallucination cases.

## Core knowledge
Correctness and groundedness differ: an answer may be factually correct but unsupported by supplied evidence. Citation presence is not citation quality. Evaluation should consider claim support, source authority, attribution completeness, and whether unsupported inference is clearly marked.

## Procedure
1. Break representative answers into material factual claims.
2. Map each claim to cited evidence or mark it unsupported.
3. Check whether cited passages entail, contradict, or merely relate to each claim.
4. Validate citation IDs, links, versions, and source authority.
5. Distinguish direct evidence from model inference.
6. Include questions where the corpus lacks sufficient evidence.
7. Measure grounded claim rate, unsupported claim rate, citation precision, and citation coverage.
8. Review high-impact unsupported claims manually.
9. Tune context, prompting, abstention, or retrieval based on diagnosed failure source.
10. Add regression cases for recurring failures.

## Decision points
Require stricter claim-level support in policy, legal, financial, medical, or operationally sensitive domains. Permit clearly labeled synthesis when the use case allows inference.

## Common failure patterns
Counting any citation as support, citing a document that contains only related terms, ignoring source version, evaluating answer fluency instead of evidence, and forcing citations onto unsupported claims.

## Verification
Sample evaluated claims manually and confirm automated judgments against expert review. Test deliberately unsupported questions and citation-link integrity.

## Expected output
Groundedness metrics, claim-to-evidence mappings, failure taxonomy, and release recommendations.

## Stop conditions
Stop when citation provenance is unavailable, source text cannot be recovered, or the domain requires expert interpretation that the evaluation team cannot provide.