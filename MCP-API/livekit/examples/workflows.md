# LiveKit connector examples

`livekit.room.list` (READ, no approval):
```json
{"names":["support-room"]}
```

`livekit.room.create` (WRITE, approval required by default):
```json
{"name":"support-room","emptyTimeout":300,"maxParticipants":20,"approvalId":"<payload-bound-host-approval>"}
```

`livekit.participant.permissions.update` (HIGH_RISK, explicit approval):
```json
{"room":"support-room","identity":"viewer-17","canPublish":true,"approvalId":"<payload-bound-host-approval>"}
```

`livekit.access_token.issue` (HIGH_RISK, explicit approval):
```json
{"room":"support-room","identity":"viewer-17","ttlSeconds":900,"canPublish":false,"canSubscribe":true,"canPublishData":false,"approvalId":"<payload-bound-host-approval>"}
```
The returned join token is sensitive output and must be delivered only to the intended client, never copied into an LLM prompt.

`livekit.webhook.verify` (READ, no approval):
```json
{"rawBody":"<exact raw webhook body>","authorization":"<webhook Authorization header>"}
```
