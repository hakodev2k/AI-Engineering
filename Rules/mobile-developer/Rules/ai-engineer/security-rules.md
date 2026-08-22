# AI Security Rules
## Purpose
Protect AI systems from prompt injection, data exfiltration, unauthorized actions, and insecure integrations.
## Scope
Models, prompts, RAG, tools, agents, APIs, secrets, connectors, and external content.
## MUST
- Treat model output and retrieved/user-supplied content as untrusted input.
- Enforce authentication, authorization, tenant isolation, and secret boundaries outside the model.
- Threat-model prompt injection, data exfiltration, tool abuse, insecure output handling, and supply-chain risks for material features.
- Validate and sanitize model-generated content before it enters security-sensitive sinks.
## MUST NOT
- Put credentials or privileged secrets into prompts when the task does not strictly require them.
- Let prompt instructions override access-control or security policy.
## SHOULD
- Add layered defenses and security tests proportionate to system impact.
## Exceptions
Security-control exceptions require explicit security review, risk acceptance, scope, compensating controls, and expiry.
## Verification
Use threat-model review, adversarial tests, access tests, secret scanning, dependency scanning, and configuration inspection.