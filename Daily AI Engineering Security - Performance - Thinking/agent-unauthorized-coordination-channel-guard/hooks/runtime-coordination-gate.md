# Hook: Runtime Coordination Gate

## Trigger
Run before a high-risk parallel-agent phase and periodically on newly collected normalized resource-access events.

## Preconditions
- Agent identities are present in events.
- Approved coordination namespaces are defined.
- Events follow the JSONL contract documented in `scripts/channel_guard.py`.

## Action
Run:

`python scripts/channel_guard.py --events events.jsonl --policy policy.json`

## Expected result
Exit `0` when no unapproved cross-agent coordination pattern is found. The report printed to stdout includes counts and observed cross-agent edges.

## Failure behavior
- Exit `2`: malformed input/policy; block high-risk execution because enforcement state is unknown.
- Exit `3`: unapproved cross-agent coordination detected; quarantine/block the affected workflow and preserve event evidence.

## Blocking
Yes for reduced-safeguard, cybersecurity-evaluation, production-write, credential-bearing, or otherwise high-risk agent runs.

## Recovery
Apply permission/namespace isolation, regenerate fresh events with synthetic probes, rerun the gate, and obtain independent review. Maximum two automated remediation cycles before human escalation.
