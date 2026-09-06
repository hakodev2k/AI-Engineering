# Hook: Pre-Replay Gate

**Trigger:** before any external replay/redrive command is authorized.

**Preconditions:** immutable JSONL export exists; replay policy exists; target environment is known.

**Action:**
```bash
python scripts/dlq_replay_gate.py plan \
  --input .dlq/messages.jsonl \
  --policy config/replay-policy.json \
  --environment staging \
  --out .dlq/replay-plan.json
```

**Expected result:** exit code `0`, plan status `ready`, and all intended messages status `eligible`.

**Failure behavior:** preserve the plan; resolve missing evidence or root cause. Do not manually edit statuses to bypass the gate.

**Blocks execution:** yes.
