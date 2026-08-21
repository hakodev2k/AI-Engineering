# Engineering Rules

## MUST
- MUST treat runtime hook state as executable security policy, not as UI decoration.
- MUST attest critical hooks at session start and after plugin/settings/org/profile/version changes.
- MUST fail closed when a critical required hook is missing or a critical forbidden hook is active.
- MUST use deterministic hook identities based on normalized event, matcher, and command fingerprint.
- MUST keep the approved expected-state manifest integrity-protected and reviewable.
- MUST distinguish declared/configured state from observed runtime state.
- MUST preserve evidence before remediation.
- MUST bound automated remediation to one clean reload/restart before escalation.
- MUST keep reports redacted; command hashes are preferred over full command bodies.
- MUST independently verify high-risk enforcement hooks when the runtime listing itself is not authoritative.

## MUST NOT
- MUST NOT assume `enabled=false` means all plugin hooks are inactive without runtime evidence.
- MUST NOT assume a managed settings file present on disk is active at runtime.
- MUST NOT trust `/hooks`, UI badges, MDM inventory, or one debug source as the sole source of truth.
- MUST NOT let the implementing agent be the sole verifier of a security-hook mismatch.
- MUST NOT execute unknown hook commands merely to discover whether they are active.
- MUST NOT silently allow unknown hooks in protected sessions unless explicit policy permits them.
- MUST NOT bypass a missing security hook by weakening sandbox, approval, audit, or permission controls.
- MUST NOT use unlimited reload/retry loops.
- MUST NOT store arbitrary hook stdout/stderr in the attestation report.

## SHOULD
- SHOULD version the hook policy and record the host/app version in each attestation.
- SHOULD invalidate attestations when relevant settings files or plugin state change.
- SHOULD use canary verification for critical PreToolUse/audit hooks when it can be performed safely in an isolated workspace.
- SHOULD measure unknown-hook rate, missing-hook rate, forbidden-hook rate, attestation latency, and recurrence.
- SHOULD maintain adapters that normalize each agent runtime into the same small JSON schema.
- SHOULD separate convenience hooks from enforcement/audit hooks using explicit criticality.
- SHOULD review unexpected third-party hook execution as a possible repository-integrity or data-exposure event.
