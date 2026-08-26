# DNSSEC Rules

## Purpose
Maintain authenticated DNS data without introducing validation outages.

## Scope
Zone signing, DNSKEY, DS, key lifecycle, and validator interactions.

## MUST
- DNSSEC-enabled zones MUST maintain a valid chain of trust and continuously monitored signatures.
- Key rollovers MUST follow a documented sequence accounting for TTLs and parent DS updates.
- Signing keys MUST be protected with access controls appropriate to their impact.

## MUST NOT
- MUST NOT remove keys or DS records before dependent cached data can safely expire.
- MUST NOT disable DNSSEC validation as a permanent workaround for signing defects.

## SHOULD
- Rollover procedures SHOULD be rehearsed and automated with human approval for high-impact transitions.

## Exceptions
Emergency trust-chain repair requires incident control, explicit approval, and post-incident reconciliation.

## Verification
Validate chains from independent resolvers, inspect signatures and expiry, monitor validation failures, and verify key custody.