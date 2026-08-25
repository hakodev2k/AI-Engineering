# Stall Watchdog Rules

- A watchdog MUST NOT classify a subagent dead from elapsed silence alone when transport is healthy and measured tail latency permits the gap.
- Every deployment MUST establish a baseline latency distribution before changing timeout behavior.
- Adaptive grace MUST have a hard upper ceiling; extensions MUST NOT be infinite.
- Retry count MUST be bounded. Two failed automatic recoveries SHOULD escalate instead of restarting the same expensive work again.
- A failed/closed transport plus stale progress MAY justify abort before the latency envelope, but the reason MUST be recorded.
- Recent completed tool/progress evidence SHOULD delay destructive abort within the hard ceiling.
- A watchdog decision MUST emit action, evidence/reason, and deadline.
- Performance claims MUST include before/after false-abort rate, completion rate, and retry-amplified cost or tokens when available.
- Security, approval, sandbox, and cancellation boundaries MUST NOT be weakened to improve throughput.