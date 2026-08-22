# Identity and API Security Playbook

## Identity
- Validate issuer, audience, signature, expiry, token type, and intended flow.
- Separate user identity from workload identity.
- Avoid long-lived shared secrets when stronger workload identity is practical.
- Review privilege escalation and confused-deputy paths.
- Treat account recovery, invitation, delegation, impersonation, and admin tooling as privileged flows.

## Authorization
- Enforce at the resource/action boundary, not only UI or route presence.
- Check tenant and ownership scope on every object access.
- Prefer explicit policy evaluation over scattered role-name checks.
- Audit administrative and high-impact actions.

## APIs
- Validate schemas and content types; constrain size and rate.
- Treat URLs, filenames, templates, query fragments, and serialized payloads as attack surfaces.
- Bound retries and pagination to prevent amplification.
- Avoid returning sensitive internal state in errors.
- Define idempotency for money, provisioning, invitations, deletion, and state transitions.

## Secrets and keys
- Store outside source control and normal logs.
- Minimize scope and lifetime.
- Define rotation and compromise response before incidents.
- Never log raw tokens or keys.

## Multi-tenant systems
- Tenant context must be derived from trusted identity/policy, not arbitrary request fields.
- Test cross-tenant negative paths explicitly.
- Review caches, search indexes, background jobs, exports, and object storage for tenant isolation.