# Privacy-Preserving NLP

## Purpose
Design NLP data and model workflows that minimize exposure of personal, confidential, and regulated text while preserving required task utility.

## When to use
Use whenever training, evaluation, retrieval, prompting, logging, or generation may process sensitive text.

## Inputs
Data inventory, privacy requirements, retention rules, model/provider architecture, logging design, access policies, task requirements.

## Preconditions
Data categories, controllers/processors, and intended purposes can be identified.

## Context to inspect
Raw corpora, annotations, prompts, vector stores, caches, logs, model providers, fine-tuning data, deletion workflows, access controls.

## Core knowledge
Text can contain direct identifiers, quasi-identifiers, secrets, inferred sensitive attributes, and memorized content. Privacy engineering applies minimization, purpose limitation, access control, retention, deletion, redaction, and provider-boundary review throughout the NLP lifecycle.

## Procedure
1. Map text flows from collection through deletion.
2. Classify sensitive fields and high-risk free-text sources.
3. Remove data not required for the task.
4. Define redaction, pseudonymization, or aggregation where utility permits.
5. Restrict corpus, vector, prompt, log, and model access by least privilege.
6. Review external model/provider retention and training policies.
7. Prevent secrets and unnecessary raw text from observability systems.
8. Design deletion propagation across derived indexes and datasets.
9. Test redaction and access controls against representative edge cases.
10. Assess memorization/extraction risk for trained models where relevant.
11. Document residual risks and approved exceptions.

## Decision points
Prefer local or controlled processing when external transfer creates unacceptable risk. Redact before model calls when semantics remain sufficient; preserve only when explicitly justified and protected.

## Common failure patterns
Assuming free text is non-sensitive, masking only obvious identifiers, retaining raw prompts indefinitely, forgetting vector-store deletion, and using production text for evaluation without purpose review.

## Verification
Data-flow inventory, access tests, retention/deletion tests, redaction tests, provider review, and privacy acceptance criteria pass.

## Expected output
Privacy data-flow map, minimization controls, retention/deletion contract, access policy, test evidence, and residual-risk record.

## Stop conditions
Stop when data purpose or legal basis is unclear, required deletion cannot be propagated, or a provider boundary violates policy.