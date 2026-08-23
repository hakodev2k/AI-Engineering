# Temporary Mitigation Rules

## Purpose
Prevent emergency workarounds from becoming invisible permanent risk.

## Scope
Feature disablement, bypasses, temporary scaling, relaxed limits, manual processes, diagnostic changes, and degraded modes.

## MUST
- Record every material temporary mitigation with owner, risk, start time, verification, and removal or review condition.
- Make security, data, cost, reliability, and customer trade-offs explicit.
- Restore or replace temporary controls after stabilization and verify normal behavior.
- Escalate mitigations that weaken security or contractual guarantees for required approval.

## MUST NOT
- Leave emergency credentials, broad access, disabled controls, debug logging, or manual bypasses active without tracked ownership.
- Call a workaround permanent without normal design and review processes.

## SHOULD
- Use automatic expiry for temporary flags, elevated access, and diagnostic settings where safe.

## Exceptions
A mitigation may remain longer when removal risk is higher, but residual risk, owner, and review date MUST be explicit.

## Verification
Audit incident records, feature/configuration state, access grants, temporary resources, follow-up tickets, and expiry mechanisms.