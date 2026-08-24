# Rules — Background Model Calls

- A background worker MUST have an owner ID, declared purpose, durable lease, and finite request/token budget before a model call.
- A worker MUST NOT call a model after its owner is `completed` or `cancelled`.
- A worker MUST NOT interpret a successful response, status 200, cached-input hit, or progress-like prose as evidence of task progress.
- Progress MUST be represented by an observable durable version/fingerprint tied to the worker's intended output.
- Counters MUST survive retry, reconnect, process restart, context compaction, and worker respawn for the same logical job.
- The runtime MUST block further calls after the configured consecutive no-progress threshold.
- The runtime MUST block further calls when request or token budgets are exhausted.
- Repeated identical request fingerprints SHOULD lower the remaining no-progress allowance and MUST be logged.
- Budget extension MUST require an explicit policy decision or human/operator approval; a worker MUST NOT extend its own hard budget.
- Foreground cancellation and terminal lifecycle state MUST propagate to every child/background worker.
- Telemetry used for enforcement MUST exclude secrets and hidden chain-of-thought.
- A runtime MUST distinguish `Implemented` from `Measured` and `Verified`; enabling a lease without replay/fixture evidence is not verified.
