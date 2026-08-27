# DNS Delegation and Registrar Operations

## Purpose
Safely manage domain registration, parent delegation, glue, and registrar transitions.

## When to use
New domains/subdomains, NS changes, registrar transfer, nameserver renumbering, or lame delegation repair.

## Inputs
Domain, registrar/registry state, child zone NS, nameserver addresses, DNSSEC DS, contacts, transfer locks.

## Context to inspect
WHOIS/RDAP data, parent NS/DS/glue, child NS/SOA, TTLs, registry constraints, account security and renewal status.

## Core knowledge
Parent delegation and child zone are separate datasets. Glue is required when nameserver names are in-bailiwick. Registrar account compromise can bypass otherwise strong DNS controls.

## Procedure
1. Verify administrative ownership and registrar security.
2. Query parent and child delegation independently.
3. Ensure new authoritative servers answer correctly before parent change.
4. Create/update required glue.
5. Coordinate DNSSEC DS state with signer changes.
6. Add new NS before removing old where feasible.
7. Wait through relevant TTLs.
8. Query from multiple public resolvers and authorities.
9. Remove old delegation only after stable observation.
10. Confirm renewal, locks, MFA, and recovery contacts.

## Decision points
Use registrar lock/registry lock for high-value domains when operational process supports controlled unlock. Delegate subzones when ownership or scale benefits outweigh coordination overhead.

## Common failure patterns
Parent/child NS mismatch, stale glue, expired domains, removing old NS early, orphaned DS causing SERVFAIL, and shared registrar credentials.

## Verification
Trace delegation, compare parent/child NS, validate glue and DS, test all authorities, and confirm registrar security state.

## Expected output
Correct delegation, documented registrar controls, transition evidence, and rollback path.

## Stop conditions
Stop without verified domain authority, when transfer/lock state is unclear, or when DNSSEC parent changes cannot be coordinated safely.