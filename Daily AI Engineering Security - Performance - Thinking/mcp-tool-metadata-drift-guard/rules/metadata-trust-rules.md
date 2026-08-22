# Rules: MCP Tool Metadata Trust

- MCP tool descriptions, schemas, and annotations MUST be treated as security-relevant untrusted input unless an explicit trust policy says otherwise.
- Approval for a tool MUST be bound to a canonical manifest digest and a server identity.
- A changed security-relevant field MUST trigger `review_required` before the changed tool can execute.
- Server identity mismatch MUST block execution.
- JSON object key ordering MUST NOT create false drift.
- Added or removed tools MUST be surfaced as drift.
- Risk annotations MUST be treated as hints, not enforcement guarantees.
- A matching or signed manifest MUST NOT disable sandbox, authorization, network, secret, or least-privilege controls.
- High-impact changed tools MUST require explicit human re-approval.
- Re-approval MUST pin the newly reviewed manifest; the old snapshot MUST NOT be silently overwritten.
- Discovery failures MUST NOT be interpreted as approval.
- Verification MUST log old/new digest and affected tools/fields without logging secrets from runtime tool arguments.
