# Svix MCP workflow examples

## Inspect delivery health

1. `svix.application.list` with `{ "limit": 25 }` — READ, no approval.
2. `svix.endpoint.list` with `{ "appId": "app_...", "limit": 50 }` — READ, no approval.
3. `svix.message.list` with `{ "appId": "app_...", "limit": 50 }` — READ, no approval.
4. `svix.message_attempt.list` with `{ "appId": "app_...", "messageId": "msg_...", "limit": 50 }` — READ, no approval.

Expected output is a JSON envelope containing `data` and `untrustedProviderContent: true`.

## Provision an endpoint

Call `svix.endpoint.create` with an application ID, HTTPS destination URL, optional description/filter types/channels, and an approval token when write approval is enabled. Risk: WRITE.

## Send a webhook

Call `svix.message.create` with `appId`, `eventType`, a JSON-object `payload`, optional `eventId`/`channels`, and an approved `approvalToken`. Risk: HIGH_RISK because this causes external delivery. Approval is always required.

## Resend a failed delivery

After identifying the destination endpoint, call `svix.message_attempt.resend` with `appId`, `messageId`, `endpointId`, and an approved `approvalToken`. Risk: HIGH_RISK. Approval is always required.
