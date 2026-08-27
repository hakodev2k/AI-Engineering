# Rules: Message Role Integrity

- Every message MUST carry stable `source_type`, `source_id`, `original_role`, and transport-hop metadata before normalization.
- Only authenticated UI/API user input MUST be emitted as trusted `role=user`.
- Assistant, tool, subagent, peer-session, framework-control, and retrieved content MUST NOT be promoted to trusted `role=user`.
- Forwarding layers MUST preserve source metadata end to end.
- Privileged tool authorization MUST NOT rely solely on natural-language content or final role.
- Privileged actions MUST require a trusted origin and configured human approval.
- Approval surfaces SHOULD display source type and transport path.
- Logs MUST preserve reason codes and message IDs but MUST NOT contain secrets.
- Missing provenance MUST fail closed.
