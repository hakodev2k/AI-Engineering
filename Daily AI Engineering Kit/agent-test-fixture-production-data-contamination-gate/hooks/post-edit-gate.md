# Hook: Post-edit Gate

**Trigger:** after any fixture, snapshot, seed, mock, cassette, or synthetic generator edit.

**Preconditions:** config validated; repository root known.

**Action:**

```bash
python3 scripts/scan-fixtures.py --repo "$REPO_ROOT" --config config/fixture-contamination.json --output /tmp/fixture-scan.json
```

Run repository-specific focused tests next. Before completion, validate the final evidence:

```bash
python3 scripts/verify-evidence.py --evidence /tmp/fixture-evidence.json --schema schemas/evidence.schema.json
```

**Expected result:** scanner exits 0, tests pass, evidence validator exits 0.

**Failure behavior:** scanner exit 2 means blocking contamination remains. Preserve output and return to bounded remediation; maximum two implementation retries.

**Blocking:** yes.