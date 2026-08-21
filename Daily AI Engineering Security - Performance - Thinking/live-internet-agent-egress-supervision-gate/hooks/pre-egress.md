# Hook: Pre-Egress Authorization

## Trigger
Immediately before any network-capable tool executes or follows a redirect.

## Preconditions
The adapter can provide destination, protocol, action class, session denial count, and approval metadata.

## Action
Serialize the pending action to JSON and run:

`python3 scripts/egress_gate.py request.json --policy config/egress-policy.json`

Interpret exit codes strictly: `0=allow`, `2=invalid input`, `4=approval required`, `5=deny`, `6=freeze`.

## Expected result
Only exit 0 permits the network action. All other outcomes prevent contact.

## Failure behavior
Malformed input, missing policy, gate exception, unresolved destination, or unknown exit code fails closed. Do not fall back to model judgment.

## Blocking
Yes. This hook blocks external execution unless the gate returns `allow`.

## Audit
Store normalized destination host, action class, decision, matched policy version, and reason. Redact credentials and configured query keys; never persist request bodies by default.
