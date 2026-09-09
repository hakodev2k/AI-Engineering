# Sauce Labs connector workflow examples

All examples below are READ operations and require no connector-level approval. Provider responses are returned as untrusted data.

## Inspect test health

1. Tool: `sauce.job.recent`
   Input: `{}`
   Permission: `READ`
   Approval: no
   Expected output shape: `{ provider, risk, untrusted_data, result }`

2. Tool: `sauce.build.list`
   Input: `{}`
   Permission: `READ`
   Approval: no
   Expected output shape: `{ provider, risk, untrusted_data, result }`

## Check real-device capacity

1. Tool: `sauce.region.current`
   Input: `{}`
   Permission: `READ`
   Approval: no

2. Tool: `sauce.device.list`
   Input: `{}`
   Permission: `READ`
   Approval: no

3. Tool: `sauce.device.status.list`
   Input: `{}`
   Permission: `READ`
   Approval: no

4. Tool: `sauce.session.list`
   Input: `{}`
   Permission: `READ`
   Approval: no

The device/session tools require Sauce Labs Private Devices plus Real Device Access API entitlement. The connector intentionally omits device-control, shell-command, file-deletion, test-run, schedule, and other modifying tools from its allowlist.
