# Rules: Request Body Safety

## MUST
- Define an intentional maximum accepted body size for every in-scope upload/import/ingestion endpoint.
- Verify enforcement at the application layer even when an edge proxy also enforces a limit.
- Treat `Content-Length` as an optimization signal, not the only enforcement mechanism.
- Keep multipart/form limits and general request-body limits consistent with endpoint intent.
- Review decompression and buffering paths for amplification and duplicate copies.
- Reject oversized requests before expensive parsing, database work, or downstream side effects when possible.
- Preserve cancellation/timeout behavior while reading large bodies.
- Test both a valid near-limit request and an oversized request.
- Record evidence for proxy/app limit alignment or explicitly mark it blocked when deployment configuration is unavailable.
- Require independent verification before status `pass`.

## MUST NOT
- Disable request-size limits globally to fix a single endpoint.
- Raise production proxy, gateway, server, or application limits without explicit human approval.
- Trust only `Content-Length`; chunked or malformed clients must still be bounded.
- Buffer an entire large request in memory when streaming is practical and required by the endpoint design.
- Log request bodies containing secrets or sensitive payload merely for verification.
- Treat scanner output as confirmed vulnerability without tracing the actual request path.
- Perform production deployment, infrastructure mutation, security-control weakening, breaking contract change, or large dependency upgrade without approval.
- Retry deterministic failing tests without a changed hypothesis or implementation.

## SHOULD
- Prefer endpoint-specific limits over application-wide exceptions.
- Keep edge and app limits close enough that rejection behavior is predictable.
- Prefer streaming to bounded storage for large files.
- Return a documented client-visible rejection such as HTTP 413 when the stack supports it.
- Include metrics for rejected oversized requests without logging body contents.
- Test decompression ratio or post-decompression size when compressed request bodies are accepted.
