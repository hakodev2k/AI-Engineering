# Privacy Boundary Rules

1. Outbound tool calls MUST be evaluated against a named trust boundary before transmission.
2. Tool arguments MUST contain only fields permitted by the configured policy or explicitly required by the tool contract.
3. Fields named as credentials, secrets, authorization data, session cookies, tokens, passwords, or equivalent MUST NOT be transmitted unless the destination is explicitly approved and the field is required for the operation.
4. Unknown tools MUST default to `review`; they MUST NOT inherit permissive rules from another tool.
5. The system MUST NOT rely on prompt instructions alone to prevent sensitive-data disclosure.
6. Sanitization MUST occur before the tool invocation, network request, third-party telemetry event, or externally visible log emission.
7. A transformation that changes an account identity, authorization scope, financial amount, production target, legal artifact, or irreversible operation MUST require human approval.
8. Sanitization MUST be deterministic for fields covered by policy.
9. Original unsanitized values MUST NOT be copied into ordinary application logs, traces, or error messages.
10. Every drop, mask, or truncation SHOULD produce an auditable transformation record containing field names but not the removed secret value.
11. Required context MUST NOT be removed merely to improve privacy metrics; ambiguous cases MUST escalate instead.
12. Verification MUST include task-validity tests in addition to privacy-exposure reduction.
