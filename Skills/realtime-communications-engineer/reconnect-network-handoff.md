# Reconnect and Network Handoff

## Purpose
Make sessions recover predictably from Wi-Fi/mobile transitions, interface changes, transient outages, and signaling disconnects.

## When to use
Use for mobile reliability, reconnect loops, ICE restarts, session-resume design, or handoff incidents.

## Inputs
Client lifecycle logs, ICE states, signaling traces, network-change events, session state model, and recovery metrics.

## Core knowledge
Signaling reconnection and media reconnection are separate concerns. Network changes may invalidate candidate pairs and require ICE restart. Session resumption must prevent duplicate participants, stale state, and unauthorized reuse.

## Procedure
1. Define recoverable versus terminal session states.
2. Separate signaling transport reconnect from media path recovery.
3. Detect network/interface changes using platform-supported signals.
4. Define bounded backoff and reconnect deadlines.
5. Trigger ICE restart only when evidence or state requires it.
6. Resynchronize authoritative session state after signaling recovery.
7. Preserve participant identity safely and reject stale epochs.
8. Handle duplicate/reordered resume messages idempotently.
9. Test Wi-Fi-to-cellular, cellular-to-Wi-Fi, short outage, long outage, sleep/wake, and server restart.
10. Measure recovery time and failure rate.

## Decision points
Resume in place when session authority and credentials remain valid; create a new session when state cannot be reconciled safely. Fast retries improve recovery only until they create load amplification.

## Common failure patterns
Infinite reconnect loops; duplicate membership; stale SDP; ICE restart on every signaling blip; losing mute/device state; retry storms during regional outages.

## Verification
Verify bounded recovery, no duplicate participants, correct media state, valid authorization, and predictable terminal behavior across the handoff matrix.

## Expected output
A tested reconnect state machine and measurable recovery policy.

## Stop conditions
Escalate when platform lifecycle limitations or server session semantics make safe resumption undefined.