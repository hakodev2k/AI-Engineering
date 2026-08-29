# Third-Party Model Provider Rules

## Purpose
Control security, privacy, availability, and dependency risks introduced by externally hosted AI models and model providers.

## Scope
Applies to hosted inference APIs, managed fine-tuning, embedding services, multimodal APIs, external moderation services, and provider-managed AI infrastructure.

## MUST
- Provider data handling, retention, model-training use, security-relevant configuration, and material subprocessors MUST be understood before sensitive data is sent externally.
- Data sent to providers MUST be minimized to the information required for the approved use case.
- Provider credentials MUST use least privilege, secure storage, and bounded lifetime where supported.
- Provider or model-version changes that can materially alter security behavior MUST trigger reassessment and relevant regression evaluation.
- Security-sensitive workflows MUST define safe behavior for provider timeout, outage, malformed response, policy failure, and unavailable safety controls.
- Sensitive production use MUST follow applicable contractual, privacy, residency, and project-specific security requirements.

## MUST NOT
- MUST NOT send secrets, prohibited information, or unauthorized sensitive data to an external provider.
- MUST NOT treat provider compliance certifications, marketing claims, or built-in safety features as substitutes for application security controls.
- MUST NOT silently switch providers or materially different model versions in security-sensitive production workflows without review.
- MUST NOT expose provider administrative credentials directly to model-controlled code or untrusted clients.

## SHOULD
- Provider access SHOULD be mediated through controlled application boundaries with egress restrictions, monitoring, and centralized credential management where practical.
- Provider incident history, service guarantees, security notifications, and deprecation policies SHOULD inform operational risk decisions.

## Exceptions
Exceptions require documented business need, provider, data classes, exposure, contractual and technical controls, residual risk, monitoring, duration, and accountable approval.

## Verification
Inspect provider configuration, data-flow documentation, contractual or policy records, credentials, outbound traffic controls, model-version tracking, security evaluations, failover tests, and provider-change approvals.