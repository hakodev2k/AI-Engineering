# Rules: MCP Task Polling Contract

- A Tasks client **MUST** measure baseline polls/task and lifecycle latency before optimization.
- The client **MUST** honor the latest applicable server `pollIntervalMs` unless an explicit protocol-compatible override is documented.
- The client **MUST NOT** issue another poll after a terminal task state is observed.
- The client **MUST NOT** issue another poll after local cancellation is accepted for that task/request.
- Polling **MUST** have both a maximum poll count and a wall-clock/deadline bound.
- Cancellation **MUST** interrupt timers/waits promptly rather than only changing parent-request state.
- Unknown task status **MUST NOT** be treated as success or terminal completion.
- `completed`, `failed`, and `cancelled` **MUST** be treated as terminal for the audited lifecycle.
- Performance claims **MUST** include before/after requests/task and terminal-detection/cancellation latency.
- Lower request count **MUST NOT** justify exceeding the accepted completion-detection SLO.
- Retry/fix loops **MUST** be bounded to at most 2 cycles by default.
- An independent verifier **SHOULD** run cancellation and post-terminal negative tests.