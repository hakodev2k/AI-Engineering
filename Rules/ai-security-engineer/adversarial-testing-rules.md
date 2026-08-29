# Adversarial Testing Rules

## Purpose
Validate that AI security controls withstand realistic malicious inputs and chained attacks rather than only normal functional tests.

## Scope
Applies to prompts, agents, RAG, multimodal inputs, APIs, model integrations, safety controls, and privileged workflows.

## MUST
- Security-critical AI features MUST have adversarial tests derived from the threat model.
- Tests MUST include direct and indirect prompt injection, authorization bypass, data exfiltration, malicious retrieved content, unsafe output handling, and tool misuse when applicable.
- Test results MUST distinguish control failures from model-quality failures.
- High-severity failures MUST block release until mitigated or explicitly risk-accepted.
- Regression cases MUST be preserved for vulnerabilities that have been fixed.

## MUST NOT
- MUST NOT declare a system secure because a small set of manually written jailbreak prompts failed.
- MUST NOT discard successful attacks as unrealistic without documented evidence.
- MUST NOT run destructive adversarial tests against production without explicit authorization and safeguards.

## SHOULD
- Combine automated suites with expert exploratory testing.
- Vary models, languages, encodings, context positions, and attack chains when relevant.

## Exceptions
Exceptions require documented scope limitations, residual risk, alternate evidence, and security approval.

## Verification
Inspect test corpus, threat-to-test traceability, failure severity, regression coverage, CI results, and approved risk acceptances.