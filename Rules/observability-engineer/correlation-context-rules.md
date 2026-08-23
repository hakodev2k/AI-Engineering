# Correlation Context Rules
## Purpose
Connect signals belonging to the same request, job, transaction, or user-visible operation.
## Scope
Trace IDs, request IDs, job IDs, message correlation, and deployment identity.
## MUST
- Define canonical correlation identifiers and propagation ownership.
- Preserve correlation through retries and asynchronous boundaries when semantics require it.
- Make deployment version discoverable from operational signals.
## MUST NOT
- Use personal or sensitive identifiers as correlation keys when safer opaque identifiers suffice.
- Create multiple conflicting correlation standards without documented mapping.
## SHOULD
- Prefer trace context as the primary technical correlation mechanism.
## Exceptions
Legacy systems may use mapped identifiers until migration is feasible.
## Verification
Follow representative transactions across logs, traces, messages, and deployment metadata.