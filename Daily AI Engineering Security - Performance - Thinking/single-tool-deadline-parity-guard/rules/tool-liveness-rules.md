# Tool Liveness Rules

1. Every awaited tool execution path **MUST** have a finite hard deadline.
2. Single/sequential execution **MUST** have liveness semantics equivalent to parallel execution.
3. Startup/connection timeout **MUST NOT** be treated as tool-call execution timeout.
4. Long-running tools **SHOULD** use idle/progress deadlines in addition to a finite hard deadline.
5. Timeout handling **MUST** cancel or terminate owned work where the runtime has ownership.
6. All paths **MUST** emit a normalized timeout disposition usable by recovery logic.
7. Automatic timeout retries **MUST** be bounded.
8. Non-idempotent or destructive calls **MUST NOT** be automatically retried after ambiguous timeout without explicit safety proof/approval.
9. Deadline values **MUST** be derived from measured workload needs and documented.
10. Performance claims **MUST** include baseline and post-change measurements.
11. Tests **MUST** include a never-returning fixture and a legitimate slow-progress fixture.
12. Missing/unknown timeout behavior **MUST** block completion.