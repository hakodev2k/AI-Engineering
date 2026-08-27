# Secrets and Sensitive Values

## Purpose
Keep credentials, tokens, private keys, personal data, and other sensitive values out of unsafe configuration channels.

## Scope
Configuration authoring, storage, distribution, rendering, logging, debugging, and rotation.

## MUST
- Secrets MUST be stored and delivered through an approved secret-management mechanism.
- Access MUST follow least privilege and be attributable to a workload or authorized human.
- Sensitive values MUST be redacted from logs, diffs, diagnostics, and generated artifacts.
- Secret references and secret values MUST be treated as different data classes where the platform supports indirection.
- Exposure or suspected exposure MUST follow the applicable incident and rotation process.

## MUST NOT
- Secrets MUST NOT be committed to source control or embedded in reusable configuration templates.
- Automation MUST NOT print secret values to prove successful retrieval.
- Secret rotation MUST NOT be executed without authorization when it can disrupt production consumers.

## SHOULD
- Prefer short-lived credentials and workload identity over static secrets.
- Scan configuration changes and artifacts for accidental secret material.

## Exceptions
A system that cannot use the approved mechanism requires documented risk acceptance, compensating controls, restricted access, and an exit plan.

## Verification
Use secret scanners, repository history inspection, access-policy review, log sampling, artifact inspection, and rotation tests. Verify that consumers can retrieve required values without exposing plaintext in routine operational evidence.