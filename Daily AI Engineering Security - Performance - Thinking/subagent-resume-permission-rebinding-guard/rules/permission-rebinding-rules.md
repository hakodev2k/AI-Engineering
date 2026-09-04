# Rules: Permission Rebinding

- A resumed or retargeted subagent **MUST** have an explicit expected permission envelope before its first tool call.
- The envelope **MUST** identify parent policy, selected child role, immutable restrictions, explicit overrides, and policy version/provenance.
- Effective runtime permissions **MUST** be compared with the expected envelope at every lifecycle transition, not only at initial spawn.
- The runtime **MUST NOT** preserve stale role-derived permissions merely because a session ID is reused.
- The runtime **MUST NOT** fall back to broader defaults when permission state is missing or ambiguous.
- Unapproved effective broadening **MUST** fail closed and block tool execution.
- Restrictive drift **MUST** be surfaced as a transition defect; the agent **MUST NOT** silently reinterpret the task as read-only or permission-gated.
- Intentional permission changes **MUST** be represented as a new contract version and, when they broaden authority or enable dangerous actions, **MUST** require explicit human approval.
- Child agents **MUST NOT** author or modify the policy evidence used to authorize themselves.
- Security logs **MUST** record normalized policy hashes and classifications without storing credentials or secret values.
- Policy comparison **SHOULD** use canonical normalized fields rather than UI labels.
- A missing runtime snapshot, malformed envelope, or unknown permission value **MUST** block completion until resolved.
- Verification **MUST** include at least one fixture for unapproved broadening, restrictive reset, stale previous-role policy, and correct inheritance.
- The implementation agent **MUST NOT** be the only verifier for production permission-policy changes.
