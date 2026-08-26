# Rules: Tool Approval Contract

- Global operator approval policy MUST be authoritative over tool-local metadata.
- A tool MUST NOT downgrade a globally required approval to `auto`, `never`, `none`, `bypass`, or an equivalent weak state.
- Code execution, shell execution, credential access, network writes, and host writes MUST be explicitly consequence-classified.
- Unknown approval semantics for a high-risk tool MUST fail closed.
- Code-execution, shell, and host-write tools MUST attest the required sandbox boundary before registration.
- Prompt-injection filtering MUST NOT substitute for authorization or sandbox enforcement.
- A policy or tool-definition change MUST re-run conformance verification.
- Effective runtime policy MUST be testable and observable; source configuration alone MUST NOT count as verification.
- Dangerous or irreversible policy downgrades MUST require explicit human approval.
