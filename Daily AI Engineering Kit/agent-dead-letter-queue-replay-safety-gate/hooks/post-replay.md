# Hook: Post-Replay Reconciliation

**Trigger:** after an approved replay tool finishes and exports receipts.

**Preconditions:** original replay plan is unchanged; receipt export contains message ID, idempotency key, status, and external receipt reference.

**Action:**
```bash
python scripts/dlq_replay_gate.py reconcile \
  --plan .dlq/replay-plan.json \
  --receipts .dlq/replay-receipts.jsonl \
  --approved \
  --out .dlq/verification.json
```

Omit `--approved` for environments that do not require approval.

**Expected result:** exit code `0` and status `verified`.

**Failure behavior:** stop further batches, preserve receipts/logs, classify mismatch, and escalate. Do not replay missing receipts automatically.

**Blocks completion:** yes.
