# Structured-Output Rules

- The executor **MUST** preserve the exact original raw output before attempting repair.
- Declared structured output **MUST** be validated locally before completion is published.
- Every invalid attempt **MUST** increment an observable terminal-attempt counter and record a normalized failure fingerprint.
- Identical invalid attempts **MUST NOT** continue beyond the configured repetition limit.
- Terminal repair loops **MUST** have both an attempt limit and a time/deadline limit.
- A formatting/schema failure **MUST NOT** automatically rerun the full underlying task.
- Repair calls **MUST NOT** invoke task tools or perform external side effects.
- Repair output **MUST NOT** add facts unsupported by the captured raw output merely to satisfy required schema fields.
- Parallel/pipeline orchestration **SHOULD** convert a terminally failed child into an explicit failed/null result according to its contract rather than blocking forever.
- The agent that produced or repaired output **MUST NOT** be the only verifier for high-impact results.
- Invalid output **MUST NOT** be silently accepted because a schema representation lacks built-in framework validation; the host must supply equivalent local validation or fail closed.