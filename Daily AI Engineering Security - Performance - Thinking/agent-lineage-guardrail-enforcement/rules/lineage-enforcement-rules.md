# Lineage Enforcement Rules

- Every spawned agent MUST have a stable `actor_id`, `parent_actor_id`, `root_actor_id`, and immutable `policy_hash`.
- High-risk tool calls MUST NOT execute when actor identity or policy proof is missing.
- Child agents MUST inherit security constraints that are at least as restrictive as the root policy unless an explicit human-approved exception exists.
- A child MUST NOT modify the policy or hook artifacts that authorize its own actions.
- Policy verification MUST occur after child startup, not only before spawn.
- Audit logs MUST record actor identity, tool, decision, policy hash, and timestamp for protected calls.
- Prompt text MUST NOT be treated as authoritative identity or policy evidence.
- Missing hook delivery for a descendant MUST be treated as a coverage failure, not as implicit allow.
- Re-launch/recovery MUST be bounded to one retry per child.
- The implementing agent MUST NOT be the only verifier of lineage coverage.
- Security verification MUST NOT be skipped for performance reasons.
- Dangerous or irreversible policy exceptions MUST require explicit human approval.