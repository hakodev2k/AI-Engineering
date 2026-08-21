# Mutation Verification Rules

- Every control-plane mutation **MUST** have a stable mutation ID and declared postconditions before execution.
- The caller **MUST** capture pre-state evidence sufficient to detect whether the mutation changed authoritative state.
- RPC/UI acknowledgement **MUST NOT** be treated as proof of committed state.
- A mutation is complete only after required postconditions are observed within the bounded consistency window.
- Dependent destructive actions **MUST NOT** run while the mutation is `indeterminate` or `verified-failure`.
- Identical deterministic failures **MUST NOT** be retried without new evidence, state change, or a materially different repair.
- Eventual-consistency observation loops **MUST** have a deadline and maximum checks.
- Verification **MUST** prefer authoritative storage/API state over cosmetic UI state when both are available.
- Verification scripts **MUST** be read-only.
- Repair, deletion, database edits, or filesystem moves **MUST** require explicit authorization outside this package.
- Conflicting evidence **MUST** produce `indeterminate`, not success.
- Logs **SHOULD** include mutation ID, operation result, pre/post observations, timestamps, and violated postconditions without leaking secrets.
