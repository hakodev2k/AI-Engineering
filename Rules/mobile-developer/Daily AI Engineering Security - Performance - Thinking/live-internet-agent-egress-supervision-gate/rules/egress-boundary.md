# Rules: Egress Boundary

- Every network-capable action MUST be authorized before execution against destination, protocol, action class, policy version, and current approval state.
- Network reachability MUST NOT be treated as authorization.
- Unknown destinations MUST default to `deny` unless an explicit approval-only discovery rule exists.
- High-impact actions to untrusted or newly discovered destinations MUST require explicit human approval.
- An approval MUST bind to the normalized destination, action class, policy version, and expiration time.
- Redirects MUST be re-authorized at the redirect target before following them.
- Wildcard host rules SHOULD be avoided; when unavoidable they MUST be constrained by suffix boundaries and action class.
- Link-local, loopback, private network, and cloud metadata addresses MUST be denied unless explicitly authorized for the task.
- Agent-generated policy expansion MUST NOT become effective without an independent policy update or human approval.
- Secrets, credentials, authorization headers, and sensitive query values MUST NOT be written to audit logs.
- Repeated denied egress attempts MUST increment an incident counter; reaching the configured threshold MUST freeze network-capable high-impact tools.
- A frozen session MUST NOT self-unfreeze.
- Policy or destination changes MUST invalidate cached approvals.
- Post-hoc model explanations MUST NOT override deterministic deny decisions.
- Security controls MUST NOT be disabled merely to improve completion rate or latency.
