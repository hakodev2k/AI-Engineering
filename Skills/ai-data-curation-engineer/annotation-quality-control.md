# Annotation Quality Control

## Purpose
Operate human annotation with measurable accuracy, consistency, and traceability rather than assuming completed labels are correct.

## When to use
Use during any scaled labeling program, especially preference data, expert review, safety labels, and subjective judgments.

## Inputs
Annotation guidelines, labeled data, annotator identifiers, gold or adjudicated examples, disagreement records, throughput metrics, and quality targets.

## Context to inspect
Inspect task difficulty, annotator training, compensation incentives, tooling UX, label distribution, shift schedules, guideline versions, and downstream model sensitivity to label noise.

## Core knowledge
Inter-annotator agreement is diagnostic, not absolute truth. Gold sets can become stale or leak. Quality monitoring should distinguish misunderstanding, fatigue, adversarial behavior, ambiguous guidelines, and genuinely subjective cases.

## Procedure
1. Define quality metrics by task type.
2. Create a reviewed calibration set with difficult boundary cases.
3. Run annotator qualification and calibration.
4. Insert blinded quality checks at controlled rates.
5. Track agreement, reversal, abstention, and latency patterns.
6. Sample ordinary production labels for adjudication.
7. Investigate systematic disagreements before penalizing workers.
8. Retrain, revise guidance, or remove unreliable work as evidence dictates.
9. Re-label affected batches when material errors are found.
10. Version quality reports with dataset releases.

## Decision points
Use consensus for low-cost judgments, expert adjudication for high-impact domain questions, and probabilistic labels where disagreement itself contains signal. Increase redundancy for uncertain or high-value examples.

## Common failure patterns
- Optimizing annotation speed over correctness
- Treating majority vote as truth
- Using trivial gold questions
- Penalizing disagreement caused by bad guidelines
- Ignoring annotator drift over time

## Verification
Implemented means quality controls run continuously. Verified means audited error rates meet targets and corrective actions demonstrably reduce recurring disagreement without hiding difficult examples.

## Expected output
Quality metrics, adjudication decisions, affected-batch remediation, annotator calibration status, and release-level quality evidence.

## Stop conditions
Stop when error rates exceed release thresholds, gold labels are unreliable, guidelines materially change without requalification, or corrective relabeling scope cannot be bounded.