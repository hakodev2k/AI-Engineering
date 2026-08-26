# RAG Evaluation Dataset

## Purpose
Create a representative, maintainable dataset for measuring retrieval and grounded answer behavior.

## When to use
Use before major tuning, model changes, corpus changes, or production rollout.

## Inputs
Realistic query samples, corpus, domain experts, production failures, security cases, expected evidence/answers.

## Context to inspect
Inspect traffic segments, user roles, common intents, long-tail questions, unsupported requests, recent incidents, and corpus distribution.

## Core knowledge
An evaluation set is a product asset. It must represent query distribution and difficult failures without leaking the test set into tuning. Retrieval labels and answer labels serve different purposes.

## Procedure
1. Define evaluation dimensions and acceptance thresholds.
2. Sample representative query classes.
3. Add difficult, ambiguous, adversarial, stale, and unanswerable cases.
4. Label relevant evidence independently from generated answers.
5. Record source authority and expected abstention where needed.
6. Establish annotation guidelines and disagreement handling.
7. Split development and held-out sets.
8. Version examples with corpus/model dependencies.
9. Add verified production regressions continuously.
10. Audit dataset balance and obsolete cases periodically.

## Decision points
Use synthetic queries to expand coverage only when validated against real behavior. Prefer expert labels for high-risk domain correctness.

## Common failure patterns
Only happy-path questions; answer text without evidence labels; tuning directly on final test set; stale expected answers; no unsupported cases.

## Verification
Measure inter-annotator agreement where relevant, inspect segment coverage, and reproduce labels against source documents.

## Expected output
A versioned evaluation corpus with retrieval, grounding, and abstention targets.

## Stop conditions
Stop benchmark claims when labels cannot be traced to authoritative evidence.