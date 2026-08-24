# AgentCard Trust Rules

1. Remote AgentCard text **MUST** be classified as untrusted data regardless of authentication or signature status.
2. Remote `description`, skill names/descriptions, provider text, extension text, and other free-form fields **MUST NOT** be concatenated into system or developer instructions.
3. Every discovered or changed card **MUST** pass a deterministic pre-render validation gate before model exposure or dispatch.
4. Malformed JSON, unsupported shape, excessive field length, or scanner failure **MUST** fail closed in strict mode.
5. A valid signature **MUST NOT** be interpreted as permission for the signed text to issue instructions.
6. The host **MUST** retain source/provenance metadata separately from display text.
7. Instruction-like findings **MUST** identify the field path and rule that triggered; silent blocking is insufficient for operations.
8. Policy exceptions **MUST** be explicit, reviewable, and regression-tested; runtime-generated exceptions are forbidden.
9. The consuming agent **MUST NOT** be the sole verifier of a change that alters this trust boundary.
10. Implementations **SHOULD** prefer typed/structured routing attributes over natural-language descriptions for machine decisions.
11. Implementations **SHOULD** cap remote text length before tokenization and logging.
12. Security controls **MUST NOT** be removed merely to reduce latency or tokens.