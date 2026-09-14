# Keygen MCP workflow examples

## Inspect and validate a license

1. `keygen.license.list`

```json
{"limit":25,"page":1}
```

Permission: `READ`. Approval: no.

2. `keygen.license.get`

```json
{"id":"11111111-1111-4111-8111-111111111111"}
```

Permission: `READ`. Approval: no.

3. `keygen.license.validate`

```json
{"id":"11111111-1111-4111-8111-111111111111","fingerprint":"device-fingerprint"}
```

Permission: `READ`. Approval: no. Expected output is the Keygen JSON:API validation response.

## Create a license

`keygen.license.create`

```json
{"policyId":"22222222-2222-4222-8222-222222222222","name":"Customer seat","expiry":"2027-01-01T00:00:00Z","approvalId":"<64-hex host-generated approval>"}
```

Permission: `WRITE`. Approval: required. `KEYGEN_ALLOW_WRITES=true` must also be configured.

## Suspend or reinstate

`keygen.license.suspend` and `keygen.license.reinstate` take a license UUID and a host-generated approval token. Both are `HIGH_RISK` because they directly change customer entitlement state.

## Deactivate a machine

`keygen.machine.deactivate`

```json
{"id":"33333333-3333-4333-8333-333333333333","approvalId":"<64-hex host-generated approval>"}
```

Permission: `DESTRUCTIVE`. Approval: required. Both `KEYGEN_ALLOW_WRITES=true` and `KEYGEN_ALLOW_DESTRUCTIVE=true` must be configured.
