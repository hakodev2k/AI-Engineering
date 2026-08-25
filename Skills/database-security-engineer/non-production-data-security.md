# Non-Production Data Security

## Purpose
Prevent development, test, analytics, and support environments from becoming weaker copies of production data risk.

## When to use
Use when refreshing environments, generating test data, granting developer access, or reviewing lower-environment exposure.

## Inputs
Data classification, test requirements, masking/tokenization tools, environment access model, and retention rules.

## Context to inspect
Inspect snapshots, dumps, CI artifacts, developer laptops, shared sandboxes, logs, and downstream test integrations.

## Core knowledge
Lower environments often have broader access and weaker controls. Prefer synthetic data. When realistic data is necessary, de-identification must address direct and indirect identifiers and re-identification risk.

## Procedure
1. Determine the minimum data characteristics tests require.
2. Prefer synthetic generation.
3. If production-derived data is justified, select masking, tokenization, or anonymization appropriate to use.
4. Preserve referential and statistical properties only as needed.
5. Remove secrets and credentials embedded in data.
6. Restrict environment access and outbound integrations.
7. Apply retention and cleanup.
8. Validate that protected fields cannot be trivially reversed or joined back to identities.

## Decision points
Use reversible tokenization only when authorized re-identification is required; otherwise prefer irreversible transformation. Production-like security controls may still be required for highly sensitive derived datasets.

## Common failure patterns
Raw production restores, deterministic masking with easy lookup, real emails triggering external messages, forgotten dumps, and treating hashed identifiers as anonymous without threat analysis.

## Verification
Run classification-aware scans, re-identification checks, access reviews, and cleanup validation.

## Expected output
Fit-for-purpose test data with minimized confidentiality risk.

## Stop conditions
Escalate when realistic data use lacks authorization or de-identification cannot meet required privacy/security constraints.