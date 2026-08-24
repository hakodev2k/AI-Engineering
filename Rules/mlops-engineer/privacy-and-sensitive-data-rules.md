# Privacy and Sensitive Data Rules

## Purpose
Minimize exposure of personal, confidential, regulated, or otherwise sensitive data throughout the ML lifecycle.

## Scope
Covers datasets, features, logs, experiment artifacts, model outputs, caches, backups, and debugging workflows.

## MUST
- Sensitive data MUST be classified and handled according to applicable project policy before use in ML workflows.
- Collection and retention MUST be limited to data necessary for the approved purpose.
- Access MUST be authorized, auditable, and separated by environment where required.
- Logs, metrics, traces, and experiment records MUST avoid raw sensitive values unless explicitly required and protected.
- Deletion/retention obligations MUST account for derived ML datasets and artifacts where applicable.

## MUST NOT
- Production sensitive data MUST NOT be copied into development environments without an approved protection strategy.
- Debugging convenience MUST NOT justify uncontrolled exports or persistent local copies.

## SHOULD
- De-identification, aggregation, tokenization, or synthetic data SHOULD be preferred when they satisfy the engineering need.
- Data inventories SHOULD map sensitive sources to downstream model artifacts.

## Exceptions
Exceptions require documented purpose, legal/policy basis where applicable, minimized scope, safeguards, retention limit, and approval.

## Verification
Inspect classifications, access logs, retention settings, lineage, sample telemetry, storage encryption/configuration, deletion workflows, and environment boundaries.