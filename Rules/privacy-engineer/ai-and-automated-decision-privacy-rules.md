# AI and Automated Decision Privacy Rules

## Purpose
Control privacy risks created by machine learning, generative AI, profiling, and automated decisions.

## Scope
Training data, prompts, embeddings, features, model outputs, profiling, recommendation, scoring, and automated decisions involving personal data.

## MUST
- Personal data used for AI MUST have a documented purpose, necessity, provenance, and approved basis where applicable.
- Sensitive attributes, inferred traits, and proxy variables MUST be identified and risk-assessed.
- Model inputs and outputs MUST follow retention, access, deletion, and disclosure requirements appropriate to their sensitivity.
- Systems making consequential automated decisions MUST document human review, contestability, and transparency controls where required.
- Model providers and external AI services MUST be assessed for data retention, training reuse, residency, access, and subprocessor behavior.

## MUST NOT
- MUST NOT send confidential personal data to unapproved AI services.
- MUST NOT assume generated output is non-personal merely because it is inferred rather than directly collected.

## SHOULD
- Prefer minimized, pseudonymized, aggregated, or synthetic inputs when equivalent outcomes are possible.

## Exceptions
Require documented need, risk assessment, safeguards, owner, expiry where relevant, and approval.

## Verification
Inspect datasets, prompts, model configurations, provider terms, data-flow records, retention settings, decision workflows, and evaluation evidence.