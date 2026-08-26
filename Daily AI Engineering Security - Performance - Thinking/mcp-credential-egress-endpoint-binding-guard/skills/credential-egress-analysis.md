# Skill: Credential Egress Analysis
## Purpose
Determine whether an AI/MCP tool can send credentials or sensitive context to a model-controlled destination and enforce a deterministic destination binding.
## Trigger
New credential-bearing tool, endpoint parameter, connector integration, prompt-injection incident, or change to egress policy.
## Inputs
Tool name, credential class, destination argument, scheme/port, policy, source trust level, approval status.
## Preconditions
Sensitive values are not needed; only credential class and masked identifiers are used.
## Required context
Tool schema, expected provider endpoints, credential purpose, current network policy, threat evidence.
## Allowed tools
Read-only code/config inspection, `scripts/endpoint_binding_guard.py`, unit tests, DNS/hostname parsing without external mutation.
## Constraints
MUST NOT expose credential values in prompts, logs, fixtures or review artifacts. MUST NOT rely on the model to validate its own destination choice.
## Procedure
1. Identify every parameter that can influence a network/file/repository/message destination.
2. Identify sensitive source classes available to the tool.
3. Define credential-to-tool-to-destination bindings from official provider constraints.
4. Run deterministic validation against benign and hostile substitutions.
5. Check scheme, hostname, port, IP-literal and userinfo handling.
6. Confirm failures block before the credential-bearing operation begins.
7. Record only redacted decision metadata.
## Decision points
Allow only when tool, credential class, destination pattern, scheme and port all match policy. Otherwise block and require explicit exception approval.
## Expected output
Facts, Evidence, Source class, Sink class, Binding decision, Reasons, Verification status.
## Metrics
Attack-fixture block rate, unauthorized destination attempts, exception rate, false-positive rate, secret exposure count.
## Verification
Independent reviewer validates policy against provider documentation and reruns adversarial tests.
## Failure handling
Fail closed. Maximum 2 policy-diagnosis retries. Fallback is tool disabled or credential removed from the agent runtime.
## Stop conditions
Stop on any secret exposure, policy ambiguity for privileged credentials, or exhausted retries.
