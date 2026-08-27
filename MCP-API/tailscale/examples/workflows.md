# Tailscale connector workflows

## Inventory a tailnet

Tool: `tailscale.device.list`

```json
{}
```

Permission: READ. Approval: no.

Expected output shape: MCP text content containing JSON with `data.devices` and `untrustedProviderContent: true`.

## Inspect and approve a new device

1. Call `tailscale.device.get` with `{ "deviceId": "<device-id>" }`.
2. A human reviews the returned identity/status out of band.
3. The approval service computes the input-bound HMAC approval token for `tailscale.device.authorize`.
4. Call:

```json
{
  "deviceId": "<device-id>",
  "authorized": true,
  "approvalId": "<64-hex-human-approval-token>"
}
```

Permission: HIGH_RISK. Approval: explicit human approval required.

## Review and change subnet routes

Read with `tailscale.routes.get`:

```json
{ "deviceId": "<device-id>" }
```

To change enabled routes, after human review, call `tailscale.routes.update`:

```json
{
  "deviceId": "<device-id>",
  "routes": ["10.20.0.0/16"],
  "approvalId": "<64-hex-human-approval-token>"
}
```

Permission: HIGH_RISK. Approval: explicit human approval required.

## Remove a stale device

First inspect with `tailscale.device.get`. Removal is intentionally a separate destructive tool:

```json
{
  "deviceId": "<device-id>",
  "approvalId": "<64-hex-human-approval-token>"
}
```

Permission: DESTRUCTIVE. Approval: explicit human approval required. The connector never retries DELETE automatically.
