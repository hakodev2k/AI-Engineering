# Privacy and Data Governance

## Purpose
Design AI solutions so personal, confidential, and regulated data is collected, processed, retained, and shared only for justified purposes.

## When to use
Use for any solution handling user content, enterprise documents, telemetry, feedback, conversation history, or model-provider data flows.

## Inputs
Data inventory, classification, legal or policy requirements, retention needs, provider terms, user-consent model, and system architecture.

## Context to inspect
Inspect where data enters, is transformed, cached, logged, indexed, transmitted, reviewed, exported, and deleted. Review provider retention and training settings when applicable.

## Core knowledge
Privacy architecture is data-flow architecture. Minimize data by purpose, separate operational and analytical use, avoid unnecessary replication, and ensure deletion and access requirements propagate through derived stores and indexes.

## Procedure
1. Inventory data categories and purposes.
2. Identify personal, confidential, regulated, and derived data.
3. Map processing locations and external transfers.
4. Minimize fields and context sent to models.
5. Define retention and deletion for logs, conversations, indexes, caches, and evaluation datasets.
6. Define access and review boundaries.
7. Assess provider data-handling terms and configuration.
8. Define redaction or de-identification where appropriate.
9. Document lineage for derived artifacts.
10. Test deletion and access-control workflows end to end.

## Decision points
Prefer local or private processing when data sensitivity justifies it. Use de-identification only when it materially reduces risk and still preserves utility. Retain data only when an explicit operational or legal need exists.

## Common failure patterns
Sending entire records when a few fields suffice, forgetting vector indexes during deletion, retaining prompts indefinitely, and reusing production data for evaluation without governance.

## Verification
Data-flow review, retention tests, provider configuration checks, and access audits show the design matches approved purposes.

## Expected output
A governed data-flow design with purpose, classification, retention, transfer, access, and deletion controls.

## Stop conditions
Stop when required data use lacks approval, deletion cannot be honored, or provider handling conflicts with mandatory privacy requirements.