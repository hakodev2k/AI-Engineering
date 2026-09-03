# Rules: Agent Resource Admission

- Every material worker/process spawn MUST pass a memory admission check before launch.
- Admission MUST use current memory measurements plus an explicit worker-memory estimate and post-spawn reserve.
- A low-memory warning that does not affect the spawn decision MUST NOT be treated as a guard.
- Reclamation triggered by pressure MUST complete and memory MUST be re-measured before retrying admission.
- Reclamation/admission retries MUST be bounded; default maximum is one retry unless the policy explicitly sets a smaller or equal safe value.
- User-initiated work MUST NOT bypass the memory gate merely because it has higher product priority than speculative work.
- The runtime MUST preserve headroom for the parent/UI, operating system, and non-agent workloads.
- Fixed concurrency limits SHOULD be supplemented by memory-based admission because worker footprint and host load vary.
- The system MUST report BLOCK with measurable reason codes instead of silently spawning into unsafe pressure.
- Performance improvements MUST be supported by before/after measurements; increased task launch count alone is not evidence of improvement.
- Operators MUST NOT lower reserves, disable pressure checks, or add swap solely to make a failing gate pass without benchmark evidence.
- Dangerous host-pressure tests MUST require an isolated environment or explicit human approval.
