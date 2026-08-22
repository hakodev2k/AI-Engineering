# Hooks

## Hook — Pre-Context Tool Output Guard
**Trigger:** immediately after tool completion, before output is appended to model context or transcript summaries.

**Action:** measure, budget, spill if needed, extract bounded evidence, verify artifact integrity.

**Command:**
```bash
python scripts/tool_output_guard.py guard --input tool-output.txt --tool-name build --policy config/policy.json --output envelope.json
```

**Expected result:** exit 0 and either `mode=pass-through` or `mode=spill` with verified artifact metadata.

**Failure behavior:** fail closed for oversized output; do not inject raw payload into model context.

---

## Hook — Pre-Rehydrate Integrity Check
**Trigger:** an agent requests evidence from a spilled artifact.

**Action:** verify allowed root, expected SHA-256, and requested bounds before returning content.

**Command:**
```bash
python scripts/tool_output_guard.py rehydrate --artifact .agent-tool-output-spill/<file> --sha256 <hash> --policy config/policy.json --start-line 100 --end-line 180
```

**Expected result:** bounded excerpt with source line numbers.

**Failure behavior:** block read on hash mismatch, path escape, missing artifact, or limit violation.

---

## Hook — Post-Task Spill Metrics
**Trigger:** task completion or checkpoint.

**Action:** aggregate raw/visible bytes, spill count, rehydrate count, and reduction ratio.

**Command:**
```bash
python scripts/tool_output_guard.py analyze --events tool-output-events.jsonl
```

**Expected result:** JSON metrics summary suitable for observability dashboards.

**Failure behavior:** metrics failure does not weaken output-budget enforcement; record observability degradation separately.

---

## Hook — Final Regression Verification
**Trigger:** before enabling a changed policy in production.

**Action:** run deterministic contract/fault tests.

**Command:**
```bash
python tests/test_tool_output_guard.py
```

**Expected result:** all tests pass.

**Failure behavior:** do not deploy the policy/guard change.