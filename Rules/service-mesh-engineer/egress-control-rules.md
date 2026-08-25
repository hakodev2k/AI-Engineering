# Egress Control
## Purpose
Govern outbound service traffic and external dependency risk.
## Scope
External destinations, egress gateways, DNS, TLS origination, allowlists, and auditability.
## MUST
- External destinations MUST have explicit ownership and business purpose where controlled egress is required.
- Egress policy MUST preserve destination identity and required TLS validation.
- Critical external dependencies MUST define timeout and failure behavior.
## MUST NOT
- MUST NOT permit unrestricted outbound traffic as a workaround for missing policy.
- MUST NOT disable certificate verification for production external services.
- MUST NOT route sensitive traffic through unapproved intermediaries.
## SHOULD
- Egress SHOULD be observable by workload identity and destination without logging sensitive payloads.
## Exceptions
Temporary destination access requires owner, expiry, and security review when sensitive.
## Verification
Inspect effective egress policies, DNS/TLS behavior, denied-destination tests, gateway logs, and dependency inventories.