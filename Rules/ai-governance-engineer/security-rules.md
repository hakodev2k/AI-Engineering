# AI Security Governance Rules

## Purpose
Ensure AI systems are governed against security threats arising from models, data, prompts, integrations, agents, infrastructure, and third-party dependencies.

## Scope
Applies to AI-specific threat modeling, access, secrets, prompt injection, data exfiltration, model abuse, tool use, supply-chain risk, and security assurance.

## MUST
- Material AI systems MUST have a security threat assessment appropriate to their architecture and risk tier before production approval.
- Threat assessment MUST consider untrusted prompts, retrieval content, tool calls, model outputs, training data, external APIs, privileged actions, and cross-tenant boundaries when applicable.
- Secrets and privileged credentials MUST remain outside model-visible context unless explicitly required, minimized, scoped, and protected.
- High-impact tool execution MUST enforce authorization and policy controls outside the model rather than relying solely on prompting.
- Security controls MUST fail safely when model behavior is ambiguous or adversarial.
- Material vulnerabilities and security-relevant model or provider changes MUST trigger reassessment and remediation tracking.

## MUST NOT
- MUST NOT grant a model broad production privileges simply because downstream tools require convenient access.
- MUST NOT treat system prompts as a security boundary.
- MUST NOT assume retrieved content is trusted because it came from an internal index.
- MUST NOT disable security checks to improve model success rate without explicit risk review and approval.

## SHOULD
- AI security tests SHOULD include prompt injection, indirect injection, privilege escalation, data leakage, unsafe tool sequencing, and denial-of-service scenarios when relevant.
- Privileges SHOULD be least-privilege, short-lived, and scoped to the current operation.
- Critical controls SHOULD be independently testable without relying on the model's stated intent.

## Exceptions
Exceptions MUST document the missing control, attack surface, compensating safeguards, exposure duration, owner, and security approval. Critical unresolved exploit paths require escalation before release.

## Verification
Review threat models, identities, tool permissions, gateway policies, secrets handling, security tests, dependency scans, provider configurations, logs, and incident records. Attempt negative tests against critical boundaries.