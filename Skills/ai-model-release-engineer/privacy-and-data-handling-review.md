# Privacy and Data Handling Review

## Purpose
Verify that an AI release handles prompts, outputs, embeddings, telemetry, and provider interactions according to approved privacy and data-governance requirements.

## When to use
Use when changing models, providers, logging, retrieval, retention, regions, or any data flow involving user or sensitive information.

## Inputs
Data classifications, architecture, provider terms/configuration, retention policy, telemetry design, regional requirements, and release changes.

## Preconditions
Applicable privacy requirements and data owners are identified.

## Context to inspect
Inspect ingress data, preprocessing, prompts, retrieval, provider transfer, caches, logs, traces, feedback stores, training opt-ins, and deletion paths.

## Core knowledge
Minimize data collection and propagation. Derived representations such as embeddings can remain sensitive. Operational convenience does not override purpose limitation, retention, or regional controls.

## Procedure
1. Map data flows changed by the release.
2. Classify data at each boundary.
3. Verify collection and processing purposes.
4. Minimize fields sent to models and external providers.
5. Validate encryption, access controls, retention, and deletion.
6. Check telemetry for prompt/output leakage.
7. Confirm provider training/retention settings and region routing.
8. Test deletion or subject-right workflows when applicable.
9. Record residual risks and required approvals.

## Decision points
Prefer redaction or feature extraction over raw content when sufficient. Disable content logging when diagnostic value does not justify privacy risk.

## Common failure patterns
Assuming embeddings are anonymous, logging raw prompts by default, hidden provider retention, indefinite evaluation datasets, and regional routing changes without review.

## Verification
Trace representative data through the deployed path, inspect actual logs/stores, and confirm retention/deletion settings rather than relying on design documents alone.

## Expected output
A privacy review record with data-flow evidence, controls, exceptions, and release status.

## Stop conditions
Stop when lawful/approved processing basis is unclear, sensitive data leaves permitted boundaries, deletion cannot be honored, or specialist approval is required.
