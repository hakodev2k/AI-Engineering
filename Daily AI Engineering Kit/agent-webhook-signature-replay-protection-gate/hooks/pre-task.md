# Hook: Pre-task Validation

**Trigger:** before investigation or editing.

**Preconditions:** package directory and target repository are readable.

**Action:**

```bash
python3 scripts/scan-webhook-security.py --repo "$TARGET_REPO" --config config/gate.json --output "$OUTPUT_DIR/pre-scan.json"
```

The scanner may exit `2` when high findings exist; that is a blocking signal for implementation until findings are investigated, not proof of a vulnerability.

**Expected result:** a readable JSON scan and identified webhook-like boundaries.

**Failure behavior:** scanner runtime/config errors block execution. High findings route to investigation.

**Blocking:** yes for tool/config failure; security findings block completion until resolved or evidenced as false positives.
