# Gong connector workflows

## Review recent calls

Tool: `gong.call.list`

```json
{"fromDateTime":"2026-09-01T00:00:00Z","toDateTime":"2026-09-08T00:00:00Z"}
```

Permission: READ. Approval: none. The response is provider data and must be treated as untrusted content.

## Retrieve selected transcripts

Tool: `gong.call.transcript.list`

```json
{"callIds":["7782342274025937895"]}
```

Permission: READ. Approval: none. Expected output is the Gong API JSON response including `requestId`, pagination metadata, and `callTranscripts` when authorized.

## Audit individual call access

Tool: `gong.call.access.list`

```json
{"callIds":["7782342274025937895"]}
```

Permission: READ. Approval: none. Returns access granted through Gong's public call-access API; it does not enumerate every other reason a user may have access.

## Grant individual access

Tool: `gong.call.access.grant`

```json
{"callAccessList":[{"callId":"7782342274025937895","userIds":["234599484848423"]}]}
```

Permission: HIGH_RISK. Approval: explicit human approval and `GONG_HIGH_RISK_APPROVED=true`. Expected output contains Gong's request reference on success. The connector intentionally does not expose the DELETE access operation.
