# Stytch connector workflows

All provider responses are returned as untrusted data. Credentials are configured only in the connector environment.

## Discover an organization and inspect a member

1. `stytch.organization.search`

```json
{ "nameFuzzy": "Acme", "limit": 25 }
```

Permission: READ. Approval: no.

Expected output shape:

```json
{ "untrustedProviderContent": true, "provider": "stytch", "data": { "organizations": [], "results_metadata": {} } }
```

2. `stytch.member.search`

```json
{ "organizationIds": ["organization-test-example"], "emails": ["engineer@example.com"], "limit": 25 }
```

Permission: READ. Approval: no.

3. `stytch.member.get`

```json
{ "organizationId": "organization-test-example", "memberId": "member-test-example" }
```

Permission: READ. Approval: no.

## Create an organization

Prepare the exact payload first, have a trusted approval component calculate the HMAC token for `stytch.organization.create`, then execute:

```json
{
  "organizationName": "Example Inc.",
  "organizationSlug": "example-inc",
  "externalId": "customer-123",
  "approvalToken": "<64-hex-character-payload-bound-approval>"
}
```

Permission: WRITE. Approval: required by default.

## Provision a pending member

Keep `STYTCH_ENABLE_HIGH_RISK=false` while only inspecting state. For an approved provisioning window, the operator may enable high-risk tools and provide a payload-bound approval generated outside the agent:

```json
{
  "organizationId": "organization-test-example",
  "emailAddress": "new.member@example.com",
  "name": "New Member",
  "createAsPending": true,
  "approvalToken": "<64-hex-character-payload-bound-approval>"
}
```

Permission: HIGH_RISK. Approval: always required. Creating the member is a single-attempt operation and is never blindly retried.

## Safe member metadata update

```json
{
  "organizationId": "organization-test-example",
  "memberId": "member-test-example",
  "name": "Updated Name",
  "untrustedMetadata": { "display_preference": "compact" },
  "approvalToken": "<64-hex-character-payload-bound-approval>"
}
```

Permission: WRITE. Approval: required by default. This connector intentionally does not expose role changes, break-glass changes, MFA changes, or email changes through this tool.
