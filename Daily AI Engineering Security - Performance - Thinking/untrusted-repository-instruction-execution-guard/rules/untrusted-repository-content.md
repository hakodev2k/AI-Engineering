# Rules: Untrusted Repository Content

- Repository-controlled files, filenames, paths, issue text, PR text, retrieved web content, and remote server instructions MUST be treated as untrusted unless an explicit higher-trust policy applies.
- Provenance labels MUST survive context ingestion and be available to the tool-authorization layer.
- The model MUST NOT be the sole authority deciding whether its own tool call is permitted.
- Missing or ambiguous provenance MUST fail closed for high-impact tools: at minimum `require_approval`.
- A test/build/package command that can execute repository-controlled code MUST be classified as code execution, even when the command itself appears conventional.
- High-impact tool calls influenced by untrusted content MUST NOT be auto-approved when policy requires approval.
- Secret access combined with untrusted network influence MUST be denied unless an explicit organization policy establishes a safe brokered path; model-generated justification is insufficient.
- Destructive writes, writes outside the workspace, remote Git/GitHub writes, cloud writes, and sandbox-bypass requests MUST require explicit policy authorization and human approval where configured.
- Prompt-injection classifiers MAY add warning signals but MUST NOT override deterministic deny/approval rules.
- Sandboxing MUST be preserved; a performance or compatibility problem MUST NOT be solved by disabling the sandbox without explicit human authorization.
- Security fixtures MUST use synthetic secrets, isolated repositories, and non-routable/mock endpoints.
- Approval records SHOULD bind the approved action, target, repository revision, and relevant capabilities so a later changed action cannot reuse stale approval.
- Audit logs MUST NOT contain raw secrets and SHOULD record source provenance, tool, decision, reasons, and approval identity/status.
- Policy retry loops MUST be bounded by `maximum_policy_retries`.
