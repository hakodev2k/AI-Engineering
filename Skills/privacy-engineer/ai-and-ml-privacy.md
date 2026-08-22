# AI and ML Privacy Engineering

## Purpose
Identify and control privacy risks across AI/ML data preparation, training, retrieval, inference, evaluation, and output handling.

## When to use
Use for model training, fine-tuning, RAG, embeddings, AI assistants, profiling, and external model providers.

## Inputs
Use case, datasets, prompts, retrieval sources, model/provider behavior, outputs, retention, evaluation plan, and user controls.

## Context to inspect
Inspect training provenance, sensitive attributes, memorization risk, prompt logs, vector stores, access boundaries, provider reuse, and output disclosure.

## Core knowledge
AI privacy risk spans data provenance, excessive collection, memorization, membership/inference attacks, cross-user retrieval, output leakage, and secondary provider use.

## Procedure
1. Define purpose and affected subjects.
2. Inventory training, retrieval, prompt, and evaluation data.
3. Minimize sensitive inputs and retention.
4. Enforce tenant and authorization boundaries before retrieval.
5. Review provider processing and training settings.
6. Test memorization and cross-user disclosure scenarios.
7. Redact or filter outputs where justified.
8. Design deletion/update propagation into indexes and derived stores.
9. Monitor privacy regressions after model or corpus changes.

## Decision points
Prefer retrieval over training on personal data when freshness, deletion, and access control matter; prefer local models only when operational trade-offs justify them.

## Common failure patterns
Training on support data by default, embedding unauthorized documents, logging prompts indefinitely, and trusting model refusal as access control.

## Verification
Run adversarial privacy evaluations across users, tenants, deleted data, and sensitive prompts.

## Expected output
An AI system with explicit privacy controls and evaluation evidence.

## Stop conditions
Block launch for unresolved cross-user leakage, unclear data rights, or uncontrolled provider reuse.