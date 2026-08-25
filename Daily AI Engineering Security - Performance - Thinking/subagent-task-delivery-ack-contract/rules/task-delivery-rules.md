# Task Delivery Rules

1. A successful spawn **MUST NOT** be treated as proof of task delivery.
2. A successful send/enqueue response **MUST NOT** be treated as proof of recipient consumption.
3. Every delegated task **MUST** have a canonical task hash and monotonic sequence number.
4. A child **MUST** acknowledge the exact task hash and sequence before its first task-specific action.
5. The parent **MUST** block acceptance of child work if action occurred before a valid ACK.
6. Material follow-up instructions **MUST** increment sequence and receive a matching ACK before the parent assumes the child changed course.
7. ACK timeout, hash mismatch, or sequence mismatch **MUST** be recorded as evidence, not silently retried.
8. Delivery retry **MUST** be limited to one; re-spawn **MUST** be limited to one additional child.
9. Recovery **MUST NOT** broaden sandbox, tools, credentials, or repository permissions.
10. Child output **SHOULD** include the final acknowledged sequence for auditability.
11. The implementing/orchestrating agent **MUST NOT** be the only verifier of a high-impact delegated change.