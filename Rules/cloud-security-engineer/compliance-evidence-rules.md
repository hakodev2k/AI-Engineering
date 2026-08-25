# Compliance Evidence

## Purpose
Produce defensible evidence that cloud security requirements are implemented and operating.

## Scope
Control mappings, audit evidence, attestations, configuration records, tests, and exceptions.

## MUST
- Compliance claims MUST reference current technical evidence or an explicitly defined manual control.
- Evidence MUST identify scope, collection time, source, and control interpretation sufficiently for independent review.
- Control exceptions MUST preserve approval, risk, owner, compensating controls, and expiry.
- Automated evidence pipelines MUST surface collection failures rather than silently reusing stale results.

## MUST NOT
- MUST NOT mark a control compliant solely because documentation says it should be configured.
- MUST NOT fabricate, backdate, or selectively omit material evidence.
- MUST NOT treat certification as proof that every workload is securely configured.

## SHOULD
- Prefer reproducible evidence queries and policy results over screenshots when equivalent.

## Exceptions
Manual evidence is acceptable when automation is impractical, provided source and reviewer are recorded.

## Verification
Reproduce sampled evidence, compare it with live configuration, inspect timestamps and scope, and review exception validity.