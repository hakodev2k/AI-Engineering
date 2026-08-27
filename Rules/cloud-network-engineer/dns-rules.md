# DNS Rules

## Purpose
Protect name resolution reliability, ownership, and security in cloud environments.

## Scope
Applies to public and private DNS zones, resolvers, forwarding, split-horizon DNS, records, and service discovery dependencies.

## MUST
- DNS zones and critical records MUST have explicit owners and lifecycle controls.
- Private DNS forwarding paths MUST be documented and tested across every intended network boundary.
- Record changes that affect production endpoints MUST include TTL, propagation, rollback, and dependency analysis.
- Resolver availability MUST match the availability requirements of dependent workloads.
- Sensitive internal names MUST remain private unless publication is explicitly approved.

## MUST NOT
- MUST NOT use excessively long TTLs where fast rollback is an operational requirement.
- MUST NOT create wildcard records that unintentionally broaden resolution scope.
- MUST NOT delete production records without confirming dependent services and rollback options.

## SHOULD
- Prefer automated DNS management with reviewable infrastructure definitions.
- Monitor resolution latency, failures, and SERVFAIL/NXDOMAIN anomalies.

## Exceptions
Exceptions require documented rationale, affected consumers, risk, and approval.

## Verification
Review zone configuration, resolver rules, effective lookup paths, TTLs, dependency tests, and change history.