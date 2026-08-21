# Permission Lease Governance

## MUST
- Bind every elevated permission to one `actor_id`, `operation_id`, explicit capability set, explicit resource scope, expiry, and use budget.
- Validate the lease immediately before every privileged tool/API call.
- Treat `executed` and `verified` as different states.
- Require explicit human approval before production writes, secret changes, infrastructure changes, destructive data actions, security-control changes, breaking contracts, or irreversible actions.
- Require an independent reviewer for high-risk renewals or scope changes.
- Verify revocation/expiry before declaring high-risk work complete when authoritative evidence is available.
- Preserve lease ID, policy version, action fingerprint, decisions, and failure evidence.

## MUST NOT
- Silently widen scope, capabilities, duration, or max-use count after a permission failure.
- Reuse a lease for another actor, operation, resource, or capability.
- Continue after expiry, revocation, or exhausted use budget.
- Store raw credentials, bearer tokens, secret values, or private keys in lease artifacts.
- Convert a denied action into an allowed action by editing evidence or bypassing the gate.
- Let the executing agent be the only reviewer for high-risk renewal/takeover decisions.

## SHOULD
- Prefer one-use leases and durations measured in minutes.
- Use provider-native scoped credentials when available.
- Keep lease issuance/revocation deterministic and tool-neutral around a shared JSON contract.
- Fail closed when resource identity or capability semantics are ambiguous.
