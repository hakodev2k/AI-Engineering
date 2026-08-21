# Cancellation Safety Rules

## MUST
- Propagate the caller-provided cancellation token through cancellable async I/O and delays in the same execution path.
- Preserve expected cancellation semantics; cancellation must remain distinguishable from faults.
- Pass tokens to database, HTTP, queue, stream, retry-delay, and other cancellable operations when supported.
- Add targeted tests when changing cancellation behavior.
- Record evidence for every confirmed cancellation defect and every accepted intentional boundary.
- Stop before any approval-required change defined in `config/cancellation-gate.yaml`.

## MUST NOT
- Replace an available request/job token with `CancellationToken.None` merely to make code compile or tests pass.
- Catch and silently swallow `OperationCanceledException` when the operation should remain canceled.
- add `.Result`, `.Wait()`, or equivalent blocking waits to an async request/job path.
- Introduce an infinite retry, polling, or delay loop without a cancellation exit.
- Change a public API contract, production configuration, schema, major dependency, or security control without explicit approval.
- Claim success when targeted cancellation tests or independent verification did not run.

## SHOULD
- Accept `CancellationToken cancellationToken = default` on internal async APIs where compatibility matters and semantics are clear.
- Check cancellation at meaningful loop boundaries for CPU-heavy work.
- Link tokens only when multiple legitimate cancellation sources must be combined, and dispose linked token sources.
- Treat scanner findings as heuristics until confirmed by execution-path evidence.
- Keep cancellation fixes separate from unrelated refactoring.
