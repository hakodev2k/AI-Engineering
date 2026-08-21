# Tool Contract Rules

## MUST
- Validate every contract before runtime fixture execution.
- Declare one side-effect level for every tool.
- Include positive, malformed-input, permission/approval, and application-error fixtures.
- Include replay/idempotency coverage for mutating tools when duplicate execution is meaningful.
- Keep fixture inputs free of real secrets and production customer data.
- Preserve evidence for every failed assertion.
- Require explicit human approval before live destructive or privileged fixtures.
- Treat runtime behavior as authoritative when it contradicts documentation; the contradiction must block verification until resolved.
- Distinguish `completed` from `verified`.

## MUST NOT
- Do not run destructive fixtures against production by default.
- Do not mark a mutating tool as read-only.
- Do not suppress failing negative tests to make a tool pass.
- Do not treat transient success after retries as proof of correctness.
- Do not log secret values, authentication headers, access tokens, private keys, or raw sensitive payloads.
- Do not change infrastructure, production configuration, secrets, database schemas, security controls, branch protections, or public API contracts without explicit approval.
- Do not let the Contract Analyst self-approve final safety readiness.

## SHOULD
- Prefer mocked or sandbox execution before live integration tests.
- Keep error envelopes machine-readable and stable.
- Prefer the smallest representative fixture set that still covers risk classes.
- Pin fixtures to semantic expectations rather than volatile timestamps/IDs.
- Record tool version/source with every verification run.
- Re-run the harness whenever tool schemas, permissions, adapters, or side-effect behavior change.