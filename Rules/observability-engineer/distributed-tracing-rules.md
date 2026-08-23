# Distributed Tracing Rules
## Purpose
Make cross-service request paths and latency attributable.
## Scope
Trace propagation, spans, sampling, and asynchronous workflows.
## MUST
- Propagate supported trace context across service and messaging boundaries.
- Create spans around material remote calls and critical processing stages.
- Record errors without duplicating sensitive payloads.
## MUST NOT
- Break upstream trace context by generating unrelated roots without reason.
- Attach secrets or unrestricted request bodies to spans.
## SHOULD
- Use semantic conventions consistently across services.
## Exceptions
Unsupported third parties require documented correlation alternatives.
## Verification
Trace representative journeys and verify parentage, timing, attributes, errors, and propagation.