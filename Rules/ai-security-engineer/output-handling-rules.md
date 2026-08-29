# Output Handling Rules

## Purpose
Ensure model outputs are treated as untrusted data until validated for the context in which they will be used.

## Scope
Applies to generated text, code, structured data, HTML, SQL, commands, URLs, files, and tool arguments.

## MUST
- Model outputs that cross a security boundary MUST be validated or encoded for the destination context.
- Generated commands, SQL, code, templates, or configuration MUST receive deterministic validation before privileged execution.
- Structured outputs MUST be schema-validated when downstream code depends on their structure.
- Output rendering MUST defend against injection classes relevant to the sink, including HTML/script injection and command injection.
- Security-sensitive decisions MUST NOT depend solely on free-form model assertions.

## MUST NOT
- MUST NOT execute model-generated code or commands with production privileges by default.
- MUST NOT render untrusted generated markup without appropriate sanitization or isolation.
- MUST NOT assume valid JSON or syntactic correctness implies semantic safety.

## SHOULD
- Prefer constrained schemas and allowlists for privileged workflows.
- Preserve provenance from model output to downstream action for auditability.

## Exceptions
Exceptions require documented sink behavior, sandboxing or compensating controls, risk evidence, and approval.

## Verification
Use schema tests, injection tests, sandbox tests, static checks, sink-specific escaping tests, and review execution boundaries.