# Post-Failure Hook

**Trigger:** consumer failure after the host records the current delivery attempt.

**Preconditions:** sanitized failure JSON matches the fields in `examples/failure.json`; policy exists.

**Action:** run:
```bash
python scripts/quarantine_gate.py validate-policy config/policy.json
python scripts/quarantine_gate.py quarantine --policy config/policy.json --failure "$FAILURE_JSON" --out "$QUARANTINE_JSON"
python scripts/quarantine_gate.py verify-envelope --policy config/policy.json "$QUARANTINE_JSON"
```

**Expected result:** exit 0 and an integrity-valid envelope only when quarantine is allowed. Exit 2/3 blocks quarantine/replay automation and preserves the original broker message under host policy.

**Failure behavior:** do not acknowledge/delete a message merely because this hook failed. Capture stderr and escalate. A message that is still within transient retry budget is expected to be rejected by the quarantine command.

**Blocking:** yes for quarantine/replay progression.
