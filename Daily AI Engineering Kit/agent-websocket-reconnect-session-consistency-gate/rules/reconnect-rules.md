# WebSocket Reconnect Rules

## MUST
- Identify the owner of connection state, session state, subscriptions, sequence/replay state, and reconnect timers before editing.
- Use bounded reconnect attempts and bounded backoff.
- Cancel or invalidate stale reconnect timers when a connection succeeds or the client stops.
- Ensure each logical subscription is restored at most once unless duplicates are explicitly required by protocol.
- Preserve or explicitly re-establish authentication/session state according to server contract.
- Validate replay/sequence continuity with evidence from tests or traces.
- Preserve failed traces and command output.
- Require independent verification after implementation.

## MUST NOT
- Retry forever.
- Create parallel reconnect loops for the same logical connection.
- Treat `onopen` as proof that application session recovery is complete.
- Reset sequence/replay checkpoints without evidence that the server expects reset semantics.
- Disable authentication, authorization, TLS, heartbeat, or replay protections to make reconnect pass.
- Change public protocol contracts, production config, secrets, or infrastructure without explicit approval.
- Push/deploy as part of this gate.

## SHOULD
- Add jitter to reconnect backoff in runtime code when many clients may reconnect simultaneously.
- Separate transport connection state from application-ready state.
- Make subscription restoration idempotent.
- Prefer monotonic sequence/checkpoint semantics.
- Test disconnects before, during, and after subscription restoration.
