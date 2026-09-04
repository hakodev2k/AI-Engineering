# Hook: Post-edit Verification

**Trigger:** after any implementation change to an affected webhook boundary.

**Preconditions:** working tree contains the intended change only or unrelated changes are explicitly identified.

**Action:**

```bash
./scripts/run-gate.sh --repo "$TARGET_REPO" --output-dir "$OUTPUT_DIR/post"
python3 scripts/validate-evidence.py --evidence "$EVIDENCE_JSON" --schema schemas/evidence.schema.json
```

Then run the target repository's relevant formatter, build, unit/integration tests, and diff inspection.

**Expected result:** deterministic gate passes, host checks pass, evidence validates, and no unrelated security-sensitive changes are present.

**Failure behavior:** preserve output and return to Implementation Agent for at most two total retries. Permission or approval failures stop immediately.

**Blocking:** yes.
