# Rules: Local Inference Boundary

- Unauthenticated model-management endpoints MUST NOT bind to non-loopback interfaces.
- Container reachability MUST NOT be achieved by widening an unauthenticated listener to `0.0.0.0` without an approved compensating control.
- Declared network scope MUST match effective listener/firewall scope.
- Model templates used by privileged agents MUST have an approved integrity fingerprint.
- Template fingerprint drift MUST block agent startup until independently reviewed.
- Model-management permissions SHOULD be separated from inference-only permissions.
- Browser-origin and DNS-rebinding threats MUST be included in local-service threat models.
- Agent sandboxing MUST NOT be treated as sufficient protection for repositories, APIs, CI/CD, MCP tools, or other delegated resources.
- Security logs MUST record reason codes and hashes, not prompt contents or secrets.
