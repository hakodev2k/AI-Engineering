# Outbox Delivery Rules

## MUST
- Use a stable message or correlation identifier across persistence, dispatcher, and consumer evidence.
- Treat broker send acknowledgement and consumer business completion as different facts.
- Preserve original timestamps, attempt counts, payload hashes, and error evidence.
- Keep production database and broker access read-only during investigation.
- Require explicit human approval for production replay, message deletion, schema changes, broker configuration changes, or permission elevation.
- Assess duplicate and ordering risk before recommending replay.
- Run deterministic verification before declaring success.

## MUST NOT
- Mark delivery successful from an outbox `processed` flag alone.
- Replay a message merely because consumer evidence is absent.
- Delete or edit an outbox/dead-letter row to unblock the workflow.
- Expose secrets or full sensitive payloads in evidence artifacts.
- Increase privileges silently.
- Retry production business operations automatically.

## SHOULD
- Prefer payload hashes and redacted metadata over payload copies.
- Correlate application logs with broker and consumer telemetry.
- Add a regression test when a code defect is confirmed.
- Document retention gaps that prevent conclusive verification.
