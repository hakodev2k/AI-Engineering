# Hook — Pre-Model-Reentry Control Check

## Trigger
Before the runtime re-enters the model because of a subagent lifecycle event, wait/status request, interruption/resume, or synthetic auto-continuation.

## Preconditions
The control event is normalized according to `schemas/control-event.schema.json`; the current causal registry and prior lifecycle state are available.

## Action
Validate provenance, causal target, lifecycle transition, completion result reference, and routing class before constructing model-visible context.

## Script / command
```bash
python scripts/control_event_guard.py event.json \
  --policy config/control-event-policy.json \
  --known-causal causal-ids.json \
  --prior-state running
```

## Expected result
Exit `0` with `status=pass` for a valid event. Exit `2` for a blocked invariant. Exit `3` for malformed input/policy.

## Failure behavior
Do not re-enter the model with the malformed event. Preserve the last verified user goal and known-good lifecycle state, quarantine the event, surface an orchestration error to the host, and require a corrected runtime transition. Never repair provenance by guessing.

## Blocks completion
Yes. An unresolved control-event integrity failure blocks autonomous continuation and final Verified status.

## Deterministic scope
This hook validates observable event semantics. It does not inspect hidden reasoning and does not decide whether the model's substantive answer is correct.
