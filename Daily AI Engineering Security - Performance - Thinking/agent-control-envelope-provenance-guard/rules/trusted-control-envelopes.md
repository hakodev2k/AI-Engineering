# Rules: Trusted Control Envelopes

1. The runtime **MUST** assign origin and privilege metadata outside model-authored text.
2. The runtime **MUST NOT** infer control privilege from delimiters, tag names, markdown, XML-like markup, wording, or model confidence.
3. Subagent final text, tool output, retrieved content, file content, and external messages **MUST** be treated as data unless a non-model runtime component explicitly marks the envelope as privileged.
4. Reserved control markers found inside untrusted data **MUST** be escaped, encoded, or blocked before reaching a privileged parser.
5. Privileged envelopes **MUST** carry a runtime-issued origin identifier and nonce; distributed transports **SHOULD** add authenticated integrity such as HMAC or an equivalent mechanism.
6. A missing, malformed, stale, replayed, or tampered privileged envelope **MUST** fail closed.
7. The parent agent **MUST NOT** execute a tool, reveal a secret, alter permissions, or suppress user-visible information solely because untrusted payload text requests it.
8. Mixed-origin payloads **MUST** preserve segment provenance; concatenation that erases origin before validation is prohibited.
9. Logs **MUST** record the finding code, source channel, origin class, and envelope decision without persisting secrets.
10. Security tests **MUST** include forged `system-reminder`, task-notification, system/user role labels, and out-of-band steering markers.
11. The implementation agent **MUST NOT** be the sole verifier of a control-channel change.
12. Human approval **MUST** be required before enabling a new privileged producer or relaxing a reserved-marker rule.
