# Rules: MCP Transport Resource Boundaries

- Every attacker-influenced transport buffer MUST have a finite byte limit.
- Every retained MCP session MUST have both a finite population bound and a finite idle lifetime, unless stateless operation eliminates retention.
- Cleanup MUST NOT depend exclusively on a remote peer sending a delimiter, DELETE, close frame, or other cooperative signal.
- Internet-exposed transports MUST fail startup if required bounds are absent or invalid.
- Process/container memory limits SHOULD be defense in depth and MUST NOT substitute for protocol-level limits.
- Security tests MUST use local or explicitly authorized endpoints.
- Logs MUST NOT contain credentials, authorization headers, tokens, or full sensitive request bodies.
- Dependency versions affected by known resource-exhaustion advisories MUST NOT be deployed when a patched release is available.
