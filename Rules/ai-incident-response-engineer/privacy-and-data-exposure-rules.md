# Privacy and Data Exposure Rules

## Purpose
Control privacy risk when AI systems expose, infer, retain, or transmit sensitive information unexpectedly.

## Scope
Applies to personal data, confidential data, training/retrieval content, prompts, outputs, logs, traces, memory, and third-party AI providers.

## MUST
- Suspected data exposure MUST identify data classes, affected subjects or tenants where possible, recipients, persistence, and time window.
- Investigation access MUST follow least privilege and need-to-know principles.
- Incident artifacts MUST minimize sensitive content while retaining sufficient evidence.
- Potential cross-tenant or unauthorized disclosure MUST be escalated according to privacy and security policy.
- Deletion, quarantine, or retention actions MUST respect legal, contractual, forensic, and regulatory requirements.
- Third-party transmission paths MUST be assessed when external model or tool providers are involved.

## MUST NOT
- Sensitive content MUST NOT be broadly reproduced in screenshots, tickets, or collaborative channels.
- Responders MUST NOT promise deletion, notification, or regulatory conclusions outside their authority.
- Privacy impact MUST NOT be inferred solely from model intent; actual data flows and recipients must be investigated.

## SHOULD
- Use redacted examples and secure evidence stores.
- Coordinate early with privacy/legal functions for potentially reportable incidents.

## Exceptions
Unredacted evidence may be retained only where necessary, access-controlled, and justified by investigation or legal requirements.

## Verification
Inspect data-flow evidence, access logs, redaction practices, provider records, retention actions, and escalation documentation.