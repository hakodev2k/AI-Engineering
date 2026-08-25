# Model Routing Contract Rules

## Scope
These rules govern any workflow where model identity, reasoning effort, provider, service tier, sandbox mode, or inheritance behavior is material to cost, latency, security, or decision quality.

## Enforceable rules
- The orchestrator **MUST** record routing intent before dispatch for every field that matters to acceptance.
- Requested configuration **MUST NOT** be treated as evidence of effective runtime routing.
- A model **MUST NOT** be asked to self-report its own identity as the sole verification source.
- Runtime evidence **MUST** come from provider/request metadata, child `turn_context`, session logs, or an equivalent host-controlled source.
- When `allow_inherit=false`, inherited routing **MUST** block acceptance even if the inherited model happens to have the same display name.
- Missing evidence for a required field **MUST** be treated as drift, not as a pass.
- Consequential review output **MUST NOT** be accepted until post-spawn attestation passes.
- Cross-thread handoff, resume, fork, compaction, or model-switch events **MUST** trigger re-attestation before the next consequential decision.
- A routing mismatch **MUST NOT** be hidden by editing the intended profile after execution. The original intent and observed profile must remain auditable.
- Automatic retry **MUST** be bounded to two redispatch attempts and **MUST** change a diagnosed routing cause rather than blindly retrying.
- The implementation agent **MUST NOT** be the sole verifier for a routing-sensitive review task.
- The workflow **SHOULD** capture usage/quota metadata with the same task identifier when available.
- A weaker or cheaper fallback **MAY** be used only when the policy explicitly permits it and the fallback is recorded before result acceptance.

## Blocking conditions
Acceptance is blocked by any required-field mismatch, missing runtime evidence, forbidden inheritance, or unverifiable routing source.

## Human approval
A human must explicitly approve any intentional downgrade for security review, production changes, irreversible actions, or other high-impact decisions.
