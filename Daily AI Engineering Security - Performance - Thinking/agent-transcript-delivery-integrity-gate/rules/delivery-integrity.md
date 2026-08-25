# Rules: Delivery Integrity

- Every user-facing assistant segment MUST receive a stable identity before crossing the first asynchronous delivery boundary.
- A terminal success MUST NOT be classified as verified while a required emitted segment lacks a matching persisted record.
- Persisted content MUST match the emitted content hash for the same identity.
- Runtime code MUST NOT infer successful delivery solely from model stop reason, tool success, or presence of a final message.
- Hidden chain-of-thought MUST NOT be requested, persisted, or compared by this control.
- Presentation acknowledgement SHOULD be tracked separately from persistence when the client supports it.
- Delayed persistence MAY be retried once after an explicit flush; retries MUST be bounded.
- Missing evidence MUST NOT be repaired by deleting the corresponding emission record.
- Diagnostic ledgers SHOULD avoid raw secrets and SHOULD use hashes where raw content is unnecessary.
- A production change affecting streaming, completion, resume, export, or hydration MUST run delivery-integrity regression tests before release.