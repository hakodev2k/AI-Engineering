# Prompt Injection Defense Rules

## Purpose
Prevent retrieved content from manipulating system behavior, security controls, or tool execution.

## Scope
Applies to untrusted documents, web content, messages, code, metadata, and any retrieved text included in model context.

## MUST
- Retrieved content MUST be treated as untrusted data unless explicitly classified otherwise.
- System and application instructions MUST remain authoritative over instructions embedded in retrieved sources.
- The pipeline MUST distinguish evidence content from executable or controlling instructions.
- High-risk tool use derived from retrieved text MUST require independent policy checks and explicit authorization.
- Retrieval and generation tests MUST include adversarial prompt-injection samples representative of deployed sources.
- Sensitive system prompts, secrets, and hidden policies MUST NOT be exposed in response to instructions originating from retrieved content.

## MUST NOT
- Retrieved instructions MUST NOT directly alter authorization, tool permissions, safety constraints, or system configuration.
- A document claiming higher privilege MUST NOT be trusted solely because of its content.
- Security filtering MUST NOT be disabled to improve answer completeness.

## SHOULD
- Use structured context boundaries and explicit provenance labels.
- Apply content sanitization or instruction-detection controls when evidence shows they reduce attack success without unacceptable quality loss.
- Monitor injection attempts and suspicious retrieval patterns.

## Exceptions
Exceptions require threat-model review, documented compensating controls, evidence, and explicit human approval for any behavior that increases execution authority.

## Verification
Run prompt-injection red-team suites, tool-authorization tests, secret-exfiltration tests, context-boundary inspections, and incident telemetry reviews.