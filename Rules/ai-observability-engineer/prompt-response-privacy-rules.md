# Prompt and Response Privacy Rules

## Purpose
Protect sensitive user and business information while preserving sufficient observability for AI operations.

## Scope
Applies to prompts, responses, retrieved context, tool arguments, model metadata, feedback, traces, logs, and evaluation datasets.

## MUST
- Prompt, response, and retrieved-context telemetry MUST follow explicit data-classification and minimization policies.
- Sensitive content MUST be redacted, tokenized, hashed, summarized, or omitted before storage unless approved raw capture is required.
- Access to content-bearing telemetry MUST use least privilege and auditable authorization.
- Retention periods MUST be defined by data class and operational purpose.
- Deletion requirements MUST propagate to derived observability stores where technically required.

## MUST NOT
- Production prompts or responses MUST NOT be copied into unrestricted logs, metrics, traces, dashboards, or tickets.
- Observability data MUST NOT be repurposed for model training or evaluation without the required consent, policy, and governance checks.
- Redaction MUST NOT be assumed effective without representative validation.

## SHOULD
- Prefer metadata and bounded derived signals over raw content for routine monitoring.
- Use synthetic or approved sanitized examples for dashboards and runbooks.

## Exceptions
Raw-content capture requires documented necessity, data owner approval, security/privacy review, narrow access, retention limits, and a removal procedure.

## Verification
Inspect schemas, redaction tests, access-control configuration, retention policies, deletion tests, and sampled telemetry for prohibited content.