# Hook: Final Replay Verification

**Trigger:** after replay execution and receipt collection.

**Preconditions:** approved plan, guard evidence, and receipt JSON exist.

**Action:**

```bash
python scripts/validate_receipts.py --plan <plan.json> --receipts <receipts.json> --out .dlq-replay/receipt-verification.json
```

Then independently verify expected downstream state and confirm the replayed message set has not returned to the DLQ during the defined observation window.

**Expected result:** script exits 0, receipt verification is `verified`, downstream checks match `expected_outcome`, and no unplanned side effect is observed.

**Failure behavior:** stop further batches, preserve receipts/logs, classify the failure, and escalate. Do not automatically replay failures again.

**Blocks completion:** yes.
