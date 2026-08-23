# Hook Liveness Rules

- The host MUST own and enforce a finite deadline for every blocking hook.
- A child-side timer MUST NOT be the only timeout mechanism.
- Every `hook_started` MUST reach exactly one terminal state: `success`, `failure`, or `timeout`.
- Timeout measurement MUST use a monotonic clock.
- On timeout, the host MUST terminate the hook process tree, not only the immediate shell when descendants may survive.
- The host MUST emit hook id, event, elapsed time, disposition, and bounded diagnostics.
- Captured stdout/stderr MUST be size-bounded and MUST NOT intentionally include secrets.
- A hook timeout MUST NOT be silently treated as successful policy enforcement.
- Security-sensitive fail-open/fail-closed behavior MUST be explicit policy; liveness recovery MUST NOT weaken the configured security disposition.
- Batch execution MUST have bounded completion and MUST NOT wait forever for one child.
- Retrying a timed-out hook MUST require a changed condition or explicit policy and MUST be bounded to at most one automatic retry.
- The verifier SHOULD confirm no descendant process remains after timeout.
- Operators MUST establish a baseline before claiming latency improvement.