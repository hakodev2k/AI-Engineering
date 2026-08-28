# Rules: MCP Content Trust Boundary

- Third-party MCP content MUST carry explicit provenance until task completion.
- Untrusted content MUST NOT be promoted into system/developer policy.
- Untrusted content MUST NOT authorize privileged tool calls.
- Privileged tools MUST be classified independently of the MCP server that produced the content.
- Untrusted-to-privileged crossings MUST require trusted policy authorization and explicit human approval when policy requires it.
- Approval MUST identify the requested privileged action and its untrusted content provenance.
- Secret values MUST NOT be logged, echoed into evidence, or sent to destinations selected solely by untrusted content.
- Read-only MCP servers MUST NOT be treated as low-risk solely because their own tools cannot write.
- Injection classifiers SHOULD be supplemental controls; deterministic authorization MUST remain primary.
- Security verification MUST include benign and adversarial fixtures.
