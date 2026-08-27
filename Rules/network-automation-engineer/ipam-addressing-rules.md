# IPAM and Addressing Rules

## Purpose
Protect uniqueness, ownership, and routability of automated network addressing.

## Scope
IP addresses, prefixes, pools, reservations, VRFs, subnets, point-to-point links, and address lifecycle.

## MUST
- Address allocation MUST come from an authoritative allocation system or deterministic approved policy.
- New allocations MUST check overlap and uniqueness within the relevant routing context.
- Prefix ownership, purpose, and lifecycle state MUST be recorded.
- Automation MUST distinguish address identity from mutable device/interface names.
- Deallocation MUST account for references and required quarantine or reuse delay.

## MUST NOT
- MUST NOT allocate production addresses by scanning for apparently unused values alone.
- MUST NOT silently reuse an address or prefix whose ownership is ambiguous.
- MUST NOT collapse overlapping address spaces across VRFs or tenants during validation.

## SHOULD
- Allocations SHOULD be transactional where concurrent automation can compete for the same pool.
- Address changes SHOULD preserve historical provenance sufficient for incident investigation.

## Exceptions
Manual emergency allocation requires explicit owner, conflict check, reconciliation deadline, and later import into the authoritative system.

## Verification
Run overlap/uniqueness checks, concurrent allocation tests, reference checks before release, routing-context validation, and compare deployed addresses with authoritative records.