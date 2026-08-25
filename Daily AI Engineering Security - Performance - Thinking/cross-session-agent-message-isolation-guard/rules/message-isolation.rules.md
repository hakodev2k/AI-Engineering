# Rules — Cross-Session Message Isolation

1. Every delivered peer message MUST include stable `sender_session`, `recipient_session`, `message_id`, and `sender_role` fields.
2. A workflow child MUST include `workflow_id` and `parent_session`.
3. A workflow child MUST NOT message a session outside its declared workflow unless a human approval explicitly names the destination session.
4. Same-user or same-machine status MUST NOT imply trust.
5. A relayed or agent-originated message MUST NOT carry `authority=human`.
6. The displayed sender SHOULD identify both child principal and parent lineage; the parent alone MUST NOT be presented as the true sender.
7. A reply MUST reference the original `message_id` and MUST route to the original sender session/principal, not whichever session is currently active.
8. Cross-workflow approval MUST be purpose-scoped and SHOULD expire after one message unless the human explicitly approves a bounded conversation.
9. Missing provenance MUST fail closed.
10. Security logging MUST record decisions and reason codes but MUST NOT log secrets or full message bodies by default.
11. The implementing agent MUST NOT be the sole verifier of routing and authority behavior.
12. A failed regression MUST block release of messaging-policy changes.
