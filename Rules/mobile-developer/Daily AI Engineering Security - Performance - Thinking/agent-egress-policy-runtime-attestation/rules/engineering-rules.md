# Engineering Rules

## MUST
- MUST treat configured/displayed network policy as desired state, not proof of effective enforcement.
- MUST establish a runtime attestation baseline before claiming an agent environment is network-restricted.
- MUST include at least one approved deny control when the intended policy contains restrictions.
- MUST re-attest after policy, proxy, sandbox, runtime, task, or session identity changes.
- MUST bind every attestation report to a SHA-256 hash of the policy manifest.
- MUST run probes from the same execution boundary used by agent tools.
- MUST classify mismatches as over-permissive, over-restrictive, or indeterminate.
- MUST stop sensitive/network-dependent automation on any over-permissive result.
- MUST keep probes credential-free, bounded, and non-destructive.
- MUST preserve least privilege during remediation.
- MUST use independent verification after a security-boundary remediation.

## MUST NOT
- MUST NOT infer enforcement from UI text, parsed config, or a successful config save alone.
- MUST NOT auto-expand an allowlist because a dependency fails.
- MUST NOT add wildcard domains, disable the sandbox/proxy, or use permission-bypass flags as a diagnostic shortcut.
- MUST NOT probe arbitrary third-party hosts at scale.
- MUST NOT follow redirects to undeclared destinations during attestation.
- MUST NOT include secrets, auth headers, cookies, API keys, or private payloads in probes or reports.
- MUST NOT accept a previously cached attestation when its policy hash or runtime identity differs.
- MUST NOT retry indefinitely; remediation loops are capped at two attempts.

## SHOULD
- SHOULD use organization-owned control endpoints for deny probes where practical.
- SHOULD include representative package registry/CDN/auth destinations for required-allow tests when those services are in scope.
- SHOULD record task/session creation time to identify stale-policy snapshots.
- SHOULD record attestation latency and failure type for operational diagnosis.
- SHOULD keep allowlists explicit and version-controlled.
- SHOULD separate availability remediation from security-policy changes.
- SHOULD alert when a policy remains unattested beyond the configured lifetime.

## Observable acceptance rules
A policy is `Verified` only when all declared allow probes are reachable, all declared deny probes are unreachable, policy hash matches current config, runtime identity matches the agent execution environment, and an independent verifier has reviewed the report after any remediation. Otherwise status is `Implemented` or `Measured`, never `Verified`.
