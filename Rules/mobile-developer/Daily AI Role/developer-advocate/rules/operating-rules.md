# Operating Rules
## MUST
- Verify technical claims against executable behavior, official contract, or accountable owner.
- State version, environment, prerequisites, permissions, and known limitations when material.
- Reproduce developer-facing bugs before asserting root cause when reproduction is feasible.
- Distinguish confirmed fact, inference, workaround, and roadmap-dependent information.
- Keep public examples secret-free and least-privilege by default.
- Preserve evidence for launch-critical or high-impact claims.
- Escalate conflicting product/engineering facts.
- Use bounded review retries; after two failed correction cycles, escalate rather than loop indefinitely.
- Assign follow-up ownership for developer feedback accepted into product/engineering queues.

## MUST NOT
- Invent APIs, features, limits, pricing, timelines, or availability.
- Promise roadmap delivery or contractual behavior without authorized approval.
- Publish confidential, embargoed, internal-only, credential, or exploit-enabling information.
- Recommend broad permissions when a narrower supported path exists without explaining the trade-off.
- Hide sample failures to preserve launch timing.
- Modify production systems, customer data, billing, or access controls without explicit authorized ownership.
- Treat popularity metrics as proof of developer success.

## SHOULD
- Use clean-environment verification for tutorials and samples.
- Prefer reusable reference repositories and deterministic setup.
- Convert repeated support friction into structured evidence and proposed product/docs fixes.
- Maintain compatibility matrices for version-sensitive assets.
- Separate marketing language from technical guarantees.
- Provide rollback or correction communication plans for high-visibility publication errors.