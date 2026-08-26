# Rules: Sandbox Security

- Custom-code execution MUST run with least privilege and MUST NOT share a privileged host process.
- Known vulnerable platform versions in `config/sandbox-policy.json` MUST NOT be deployed.
- Custom-code paths MUST have explicit module, network-egress, and filesystem-write policies.
- Host process objects, host global constructors, unrestricted module imports, and shared privileged workers MUST NOT be reachable from the sandbox interface.
- Module allowlist additions MUST receive security review for transitive capability exposure.
- Security tests MUST NOT execute destructive RCE payloads against production or shared environments.
- Sandbox-boundary failures MUST block release or deployment until remediated and independently verified.
- Secrets MUST NOT appear in fixtures, guard output, or diagnostic logs.
- Temporary mitigations SHOULD reduce authoring access and disable unnecessary custom-code features, but MUST NOT be represented as a full remediation when an official patch exists.
