# Rules: Untrusted MCP Server Content

1. Server-authored natural language **MUST** be classified as untrusted unless a stronger trust relationship is explicitly established and independently enforced.
2. Untrusted server content **MUST NOT** be concatenated into host system/developer instructions as authoritative policy.
3. Provenance **MUST** be retained for every server-provided instruction, description, prompt, resource, and tool result that reaches the model.
4. Server content **MUST NOT** grant, widen, or reconfigure tool permissions, credential scopes, filesystem scope, network scope, or repository scope.
5. Server content **MUST NOT** waive human approval requirements.
6. Tool authorization **MUST** be enforced outside the model using identity, scope, and policy checks.
7. Clients **MUST** apply bounded size and control-character validation before ingesting server instructions.
8. Detection classifiers and keyword filters **MUST NOT** be treated as the sole security boundary.
9. Runtime changes to server metadata **SHOULD** trigger re-validation and provenance logging.
10. High-impact tools **MUST** use least privilege and **SHOULD** require explicit approval for irreversible actions.
11. Security logs **MUST NOT** record plaintext secrets.
12. The implementation agent **MUST NOT** be the only verifier for a change affecting prompt trust boundaries or tool authorization.
13. Unknown provenance or unknown effective authorization **MUST** block completion.