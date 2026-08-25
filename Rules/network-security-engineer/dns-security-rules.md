# DNS Security
## Purpose
Protect name resolution as a critical security and availability dependency.
## Scope
Recursive, authoritative, internal, split-horizon, and cloud DNS.
## MUST
- DNS administration MUST be access-controlled and auditable.
- Resolver recursion MUST be restricted to intended clients.
- Sensitive internal names MUST follow approved exposure policy.
- DNS changes affecting production MUST be validated for correctness and rollback.
## MUST NOT
- Open recursive resolvers MUST NOT be exposed unintentionally.
- DNS logging MUST NOT capture sensitive payloads beyond justified need.
## SHOULD
- DNS security controls SHOULD detect suspicious domains, tunneling indicators, and anomalous query behavior.
## Exceptions
Require risk assessment, data-handling review, owner approval, and expiry where temporary.
## Verification
Inspect resolver policy, authoritative configuration, external exposure, query telemetry, and change tests.