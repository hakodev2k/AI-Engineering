# Rules: Long-Running Waits

- The orchestrator MUST establish a task deadline before offloading a wait.
- A wait broker MUST NOT invoke an LLM for ordinary `pending/running` status transitions.
- Status checks MUST be idempotent and MUST NOT mutate the target task.
- A durable task/process handle MUST be validated before runtime-side polling begins.
- Push/event completion SHOULD be preferred when the provider supports it.
- Polling MUST use bounded retries, bounded total duration, and a maximum interval.
- Polling SHOULD use exponential backoff with jitter unless provider semantics require another documented cadence.
- The model MUST be woken for terminal state, cancellation, timeout, or a material state transition requiring reasoning.
- Repeated `still running` events MUST NOT be appended to the model context individually.
- Terminal results MUST be size-bounded; oversized artifacts SHOULD be stored externally and referenced by identifier/path.
- Cancellation MUST propagate to the broker and SHOULD be measurable.
- The implementation MUST collect baseline and post-change metrics before claiming an improvement.
- A timeout MUST NOT be converted into success or hidden by unlimited retries.
- Security permissions MUST NOT be broadened merely to support wait offload.
