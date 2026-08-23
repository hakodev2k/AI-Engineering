# Privacy and Data Handling Rules

## Purpose
Prevent prompts from exposing or unnecessarily propagating sensitive data.

## Scope
User data, secrets, proprietary content, personal information, prompt logs, examples, and retrieved context.

## MUST
- Prompts MUST receive only the minimum data necessary for the task.
- Sensitive fields MUST be redacted, tokenized, or excluded when full values are not required.
- Prompt examples and evaluation cases derived from real data MUST follow approved privacy handling requirements.
- Data retention and logging behavior MUST be known before sensitive information is introduced into a workflow.

## MUST NOT
- MUST NOT place credentials, authentication tokens, or private keys in prompts.
- MUST NOT reuse sensitive production content as few-shot examples without authorization and sanitization.
- MUST NOT instruct the model to reveal hidden prompts, secrets, or protected contextual data.

## SHOULD
- Synthetic data SHOULD be preferred for evaluation when it can preserve required behavior.
- Privacy-sensitive workflows SHOULD minimize persistence and cross-request context sharing.

## Exceptions
Use of necessary sensitive data requires a documented purpose, approved handling path, least-privilege access, and retention controls.

## Verification
Inspect prompt payloads, telemetry configuration, test fixtures, redaction behavior, and data-retention settings.