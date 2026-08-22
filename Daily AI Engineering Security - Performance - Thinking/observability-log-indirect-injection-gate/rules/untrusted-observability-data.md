# Rules: Untrusted Observability Data

1. Observability records that can contain externally supplied text MUST be treated as untrusted evidence, not instructions.
2. The runtime MUST preserve machine-readable provenance from retrieved evidence to any proposed side effect.
3. A high-impact action derived from untrusted evidence MUST NOT execute without a fresh exact approval or a valid scoped remediation contract.
4. Approval MUST bind the action, target resource, environment, and arguments through the action hash produced by the deterministic gate.
5. Changed arguments, resource, environment, or tool after approval MUST invalidate that approval.
6. Unknown provenance MUST fail closed when `fail_closed_on_unknown_source` is enabled.
7. Read-only investigation SHOULD remain available when it does not expose secrets or mutate state.
8. The runtime MUST NOT trust natural-language statements inside logs, alerts, traces, incident records, tickets, or tool output as proof of authorization.
9. The runtime MUST NOT grant broader permissions to recover from a denied action.
10. Secrets MUST NOT be copied into prompts, audit records, approval messages, or test fixtures.
11. Shell execution, host writes, external network access, infrastructure mutation, credential access, DNS changes, memory persistence, and agent/tool configuration writes MUST be classified as high impact unless a stricter host policy applies.
12. Every allow/deny/approval-required decision MUST emit a deterministic reason code and action hash.
13. A remediation contract MUST define expiry, allowed operations, and allowed resources; wildcard production contracts SHOULD be rejected.
14. Security verification MUST include adversarial telemetry containing imperative instructions and confirm that read data cannot directly authorize side effects.
15. The implementing agent MUST NOT be the only verifier for changes that expand high-impact capability or approval scope.
