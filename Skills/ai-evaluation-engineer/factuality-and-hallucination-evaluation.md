# Factuality and Hallucination Evaluation

## Purpose
Measure whether generated claims are correct, supported, appropriately qualified, and resistant to confident fabrication.

## When to use
Use for knowledge assistants, summarization, research, RAG, extraction-to-prose, or any workflow where unsupported claims create material risk.

## Inputs
- Model outputs
- Source evidence or trusted references
- Task instructions
- Claim-level rubric
- Domain expert access when needed

## Context to inspect
Inspect whether the task is closed-book or evidence-grounded, source freshness, citation availability, expected abstention behavior, and domain-specific truth criteria.

## Core knowledge
Factuality is best analyzed at claim level. Correctness, support, completeness, attribution, and uncertainty are distinct. Surface fluency is not evidence. A response may contain correct claims that are unsupported by provided context.

## Procedure
1. Define what evidence is authoritative for the task.
2. Segment outputs into verifiable atomic claims where practical.
3. Classify each claim as supported, contradicted, unverifiable, or not requiring verification.
4. Check whether citations or retrieved evidence actually entail the claim.
5. Evaluate omissions when completeness is part of correctness.
6. Test unknown and unanswerable cases for appropriate uncertainty or abstention.
7. Sample high-impact claims for expert human verification.
8. Report error severity as well as frequency.
9. Analyze failures by domain, claim type, and evidence availability.
10. Preserve representative hallucinations as regression cases.

## Decision points
Use deterministic reference checks for structured facts, evidence-entailment review for grounded tasks, and expert adjudication for domain claims that cannot be validated automatically.

## Common failure patterns
- Treating citation presence as factuality
- Using lexical similarity as proof
- Ignoring unsupported but correct-sounding claims
- Penalizing reasonable uncertainty as failure
- Reporting only response-level pass rates

## Verification
Recheck a representative claim sample manually, measure evaluator agreement, and confirm known hallucination cases are detected consistently.

## Expected output
A claim-level factuality report with support status, severity, uncertainty behavior, and failure slices.

## Stop conditions
Stop when no trustworthy reference or evidence standard exists for consequential claims, or when domain expertise required for adjudication is unavailable.