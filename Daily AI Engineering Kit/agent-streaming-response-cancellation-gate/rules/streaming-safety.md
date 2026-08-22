# Streaming cancellation safety rules

## MUST
- Trace cancellation from the request, message, or caller boundary to every blocking or asynchronous operation in the streaming path.
- Pass the same cancellation signal to database enumeration, HTTP calls, queue reads, delays, channel reads, response writes, and flushes when supported.
- Treat client disconnect, explicit caller cancellation, and service shutdown as distinct evidence.
- Preserve partial-output semantics and record non-cancellable operations as residual risk.
- Run the deterministic scanner and relevant tests before verified success.

## MUST NOT
- Replace a propagated token with `CancellationToken.None` or `new CancellationToken()`.
- Swallow `OperationCanceledException` and report success.
- Retry canceled side effects unless idempotency and retry safety are proven.
- Change public contracts or production settings without explicit approval.

## SHOULD
- Prefer `WithCancellation(token)` for async enumeration.
- Keep cleanup bounded.
- Test cancellation before first item, mid-stream, during downstream I/O, and shutdown.
