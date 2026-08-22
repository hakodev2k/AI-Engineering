# Privacy and Data Rules
## Purpose
Protect personal, confidential, and regulated data used by AI systems.
## Scope
Prompts, training/fine-tuning data, retrieval stores, logs, traces, vendor requests, and generated outputs.
## MUST
- Classify sensitive data and enforce permitted-use, retention, and access requirements before sending it to models or providers.
- Minimize collected and transmitted data to what the task requires.
- Redact or tokenize sensitive fields in logs and observability data where feasible.
- Understand provider retention and training-use settings for production data.
## MUST NOT
- Send secrets or sensitive data to an unapproved provider or model endpoint.
- Retain prompt or output data indefinitely without an explicit retention purpose.
## SHOULD
- Prefer privacy-preserving processing and regional controls when requirements justify them.
## Exceptions
Exceptions require documented legal/security review, purpose, scope, and approval.
## Verification
Inspect data flows, provider settings, access controls, retention configuration, logs, and privacy tests.