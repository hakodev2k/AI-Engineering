# Rules: Sandbox Read Boundary

- The runtime MUST prove effective read isolation with synthetic negative probes before handling local secrets or other data that depends on filesystem isolation.
- A parsed permission profile MUST NOT be treated as proof of enforcement.
- A generic sandbox error MUST NOT be counted as a successful denial probe.
- Forbidden probes MUST use synthetic sentinel data and MUST NOT target real credentials, private keys, tokens, or production secrets.
- Every required denied probe MUST produce an explicit denied result; any allowed result MUST block completion.
- At least one required allowed probe MUST succeed so a broken sandbox is not mistaken for a secure one.
- Probe paths MUST be canonical absolute paths before comparison.
- Operators MUST NOT disable or broaden read restrictions merely to restore agent productivity.
- Sandbox state regeneration or repair MUST be followed by a fresh attestation.
- High-risk work MUST NOT proceed when attestation status is `incomplete` or `boundary-violation`.
- Diagnostic artifacts SHOULD record versions and timestamps but MUST NOT record sentinel contents.
- The agent performing configuration changes MUST NOT be the only verifier of the resulting boundary.
- Verification retries MUST be bounded to two attempts for ambiguous setup failures; persistent failure MUST escalate to a human/operator.
