# Rules: Compaction Integrity

- The system MUST distinguish context eviction from state destruction.
- Required execution state MUST remain either model-visible or recoverably referenced after compaction.
- Omitted required state MUST have a stable reference, recoverability flag, and integrity hash.
- A truncation marker alone MUST NOT be treated as a recovery mechanism.
- Compaction MUST NOT proceed when required state is unrecoverable.
- Residual metadata MUST state what was retained, what was omitted, and why the state may be needed later.
- Sensitive payloads MUST NOT be copied into residuals when a secure reference is sufficient.
- References MUST be scoped so another user/session cannot gain access merely by learning an identifier.
- Post-compaction verification SHOULD resolve representative required references and validate hashes.
- Token savings MUST be measured together with task quality, repeated-work rate, and recovery success.
- The system MUST NOT claim token optimization success when correctness-critical context is lost.
- Recovery loops MUST be bounded to the configured maximum attempts.
