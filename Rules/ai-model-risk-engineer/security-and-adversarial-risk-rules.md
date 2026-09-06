# Security and Adversarial Risk Rules

## Purpose
Control model risks arising from adversarial manipulation, unauthorized access, data exfiltration, prompt injection, and model abuse.

## Scope
Applies to model endpoints, prompts, tools, retrieval, plugins, training assets, model artifacts, and operational access.

## MUST
- Threat modeling MUST cover abuse cases relevant to the model's capabilities and deployment context.
- High-risk systems MUST test realistic adversarial inputs, prompt injection, privilege escalation paths, and data-exposure scenarios where applicable.
- Model and system permissions MUST follow least privilege.
- Sensitive model artifacts, credentials, system prompts, and protected data MUST be access-controlled and auditable.
- Security findings that can create material harm MUST block release until mitigated or explicitly risk-accepted by an authorized human.

## MUST NOT
- Security controls MUST NOT be disabled to improve model quality or unblock a release without formal approval.
- The model MUST NOT be trusted to enforce authorization boundaries that require deterministic controls.

## SHOULD
- Adversarial testing SHOULD be updated when new attack patterns or capabilities emerge.
- Monitoring SHOULD detect suspicious usage patterns and repeated boundary probing when practical.

## Exceptions
Any exception must document threat, exposure, compensating controls, duration, residual risk, and security approval.

## Verification
Review threat models, penetration or red-team results, access policies, logs, security tests, and remediation evidence.