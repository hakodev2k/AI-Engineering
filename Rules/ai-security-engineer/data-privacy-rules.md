# Data Privacy Rules

## Purpose
Prevent AI features from collecting, exposing, retaining, or inferring personal and sensitive data beyond approved purposes.

## Scope
Applies to prompts, conversation history, embeddings, training data, telemetry, feedback, model outputs, and third-party processing.

## MUST
- Personal and sensitive data MUST be identified and handled according to applicable project policy before processing.
- Data collection and model context MUST be minimized to what the feature requires.
- Retention periods, deletion paths, and downstream copies MUST be defined for protected data.
- Access to sensitive prompts, outputs, and datasets MUST follow least privilege.
- Third-party processing of sensitive data MUST match approved contractual and technical controls.

## MUST NOT
- MUST NOT use sensitive production data for experimentation without an approved basis and safeguards.
- MUST NOT expose one user's or tenant's protected data to another through prompts, retrieval, caching, logs, or outputs.
- MUST NOT claim deletion if material copies remain undisclosed.

## SHOULD
- Prefer anonymized, pseudonymized, or synthetic data where it preserves required utility.
- Test memorization and leakage risks for high-sensitivity use cases.

## Exceptions
Exceptions require purpose, legal or policy basis, data classes, retention, risks, controls, and accountable approval.

## Verification
Inspect data-flow diagrams, schemas, retention settings, deletion tests, access controls, provider configuration, log samples, and privacy review evidence.