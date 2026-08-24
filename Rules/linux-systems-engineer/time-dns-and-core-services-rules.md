# Time, DNS, and Core Host Services Rules

## Purpose
Maintain foundational host services whose subtle failures can cascade into authentication, networking, scheduling, and distributed-system incidents.

## Scope
Applies to time synchronization, hostname identity, resolver configuration, certificate time assumptions, and other foundational host dependencies.

## MUST
- Production hosts MUST have monitored time synchronization to approved sources or hierarchy.
- Clock offset and synchronization failure MUST be observable for systems where authentication, certificates, logs, or distributed protocols depend on time.
- Resolver configuration MUST use intended DNS sources, search domains, and failure behavior for the environment.
- Hostname and address identity MUST be consistent with systems that depend on them or deviations MUST be documented.
- Changes to shared DNS or time sources MUST assess fleet-wide blast radius.

## MUST NOT
- Large clock corrections on sensitive systems MUST NOT be forced without considering application and protocol behavior.
- Persistent resolver failures MUST NOT be masked with unmanaged hosts-file entries unless the dependency explicitly permits that design.
- Public resolvers or time sources MUST NOT be introduced into restricted environments without authorization.

## SHOULD
- Use redundant sources with understood trust and failure characteristics.
- Monitor lookup latency and error rate, not just resolver process state.
- Validate certificate and authentication behavior after significant time changes.

## Exceptions
Temporary overrides require reason, bounded duration, owner, and reconciliation plan.

## Verification
Inspect synchronization status and offset, configured sources, resolver configuration, representative lookups, hostname identity, monitoring coverage, and behavior during source failure.