# SSRF and Egress Rules

## Purpose
Prevent APIs from becoming proxies into trusted networks or attacker-selected destinations.

## Scope
URL fetches, callbacks, imports, webhooks, redirects, metadata services, and outbound connections.

## MUST
- Treat user-influenced destinations as untrusted and validate scheme, host, port, redirects, and resolved addresses.
- Block access to loopback, link-local, metadata, administrative, and private destinations unless explicitly required and controlled.
- Apply network-level egress restrictions where feasible.
- Revalidate redirect targets and DNS resolution where threat conditions require it.

## MUST NOT
- Rely only on string-prefix URL validation.
- Allow arbitrary protocols or unrestricted redirects from user-controlled destinations.

## SHOULD
- Use destination allowlists for narrowly scoped integrations.

## Exceptions
Private-network access requires explicit architecture need, scoped allowlist, least privilege, monitoring, and security approval.

## Verification
Use SSRF test cases including redirects, alternate IP formats, DNS behavior, metadata endpoints, and network-policy inspection.