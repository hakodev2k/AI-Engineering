# Secrets and Credential Rules

## Purpose
Prevent AI systems from exposing, retaining, or misusing credentials and other secret material.

## Scope
Applies to prompts, model context, tool calls, source code, configuration, logs, traces, datasets, notebooks, and deployment environments.

## MUST
- Secrets MUST be stored in an approved secret-management mechanism and injected only where needed.
- Credentials available to AI components MUST have least privilege and bounded lifetime where supported.
- Inputs and outputs MUST be designed to avoid unnecessary secret exposure to models or users.
- Logs, traces, training data, and evaluation artifacts MUST redact credentials and tokens.
- Suspected credential exposure MUST trigger revocation or rotation according to incident procedures.

## MUST NOT
- MUST NOT embed secrets in prompts, source code, model weights, examples, or committed configuration.
- MUST NOT log API keys, session tokens, private keys, passwords, or equivalent authenticators.
- MUST NOT use production credentials for development or evaluation when safer alternatives exist.

## SHOULD
- Prefer workload identity and short-lived tokens over static credentials.
- Scan repositories and generated artifacts for secret leakage.

## Exceptions
Exceptions require a documented necessity, exposure boundary, expiry, compensating controls, and security approval.

## Verification
Inspect secret stores, IAM configuration, repository scans, log samples, prompt construction, evaluation artifacts, and credential-rotation evidence.