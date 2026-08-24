# Message Role Provenance Rules

1. Every context message **MUST** carry a stable `id`, `origin_id`, `source_type`, and `trusted` flag before model dispatch.
2. `role=user` **MUST** originate only from authenticated `user_input` or an explicitly documented host-generated user-proxy event that is cryptographically/session-bound to the user action.
3. Model, tool, advisor, memory, and subagent output **MUST NOT** be serialized as `role=user`.
4. `role=system` **MUST** originate only from runtime-owned `trusted_system` sources.
5. Tool/subagent/model content **MUST NOT** be promoted to `system` because it contains system-like text, XML, Markdown, JSON, or control phrases.
6. Untrusted content containing protected control markup such as `<system-reminder>` **MUST** be escaped, quarantined, or rejected before context assembly.
7. Role and trust labels **MUST NOT** be inferred from content strings.
8. Summaries/transformations **MUST** preserve the original `origin_id` and record the transformer as a new source hop.
9. A missing or unknown source type **MUST** fail closed for privileged roles and **SHOULD** remain explicitly untrusted for tool-like channels.
10. Sensitive tool calls justified by untrusted content **MUST** undergo the normal authorization/approval path; provenance checks never bypass permission controls.
11. A prompt-injection classifier **SHOULD** be defense in depth, not the sole source-to-role control.
12. Parent agents **MUST** treat subagent results as derived/untrusted instructions unless a separately authenticated policy grants a narrower capability.
13. Test fixtures **MUST** include role-confusion and protected-markup impersonation cases.
14. The component that creates/relays a message **MUST NOT** be the only verifier for high-risk role mappings.
15. Verification **MUST** fail if any privileged-role message lacks complete provenance, even if no malicious content is detected.
