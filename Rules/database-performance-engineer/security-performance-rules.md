# Security and Performance Rules
## Purpose
Ensure performance optimization never silently weakens security or data protection.
## Scope
Encryption, authentication, authorization, auditing, masking, network controls, and secure configuration.
## MUST
- Measure security-control overhead before proposing optimization and preserve required protection guarantees.
- Treat changes to encryption, audit, identity, access, or network controls as security changes requiring appropriate review.
- Keep diagnostic outputs free of credentials, tokens, and unnecessary sensitive data.
## MUST NOT
- Disable security controls to obtain benchmark results that are represented as production performance.
- Broaden database privileges as a tuning shortcut without explicit authorization.
## SHOULD
- Optimize secure configurations and access paths before considering reduced controls.
## Exceptions
Controlled laboratory tests may isolate security overhead when clearly labeled and segregated from production conclusions.
## Verification
Inspect configuration diffs, security review evidence, benchmark parity, privilege grants, logs, and sensitive-data handling.