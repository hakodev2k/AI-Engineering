# Origin Provenance Rules

1. A tool call whose policy depends on initiator **MUST** carry provenance supplied by a trusted Host boundary.
2. Origin fields supplied inside tool arguments or other caller-controlled payload **MUST NOT** be trusted for authorization.
3. Provenance **MUST NOT** replace authentication, resource authorization, input validation, sandboxing, or human approval.
4. An app-originated call **MUST** be rejected when the tool is not app-visible.
5. A model-originated call **MUST** be rejected when the tool is not model-visible.
6. A tool-specific `allowed_origins` restriction **MUST** be enforced in addition to visibility.
7. `unknown` origin **MUST** fail closed for tools marked sensitive or otherwise origin-sensitive.
8. Gateways/adapters that cannot preserve trusted provenance **MUST** downgrade the field to `unknown`, never guess.
9. Caller-claimed provenance differing from Host-attested provenance **SHOULD** be logged as a sanitized security signal.
10. Audit records **SHOULD** include tool identity, trusted origin, policy decision, request correlation ID, and approval reference without secrets.
11. Security tests **MUST** include forged caller markers and dispatch-path bypass attempts.
12. The implementation author **MUST NOT** be the sole verifier for a production enforcement change.
