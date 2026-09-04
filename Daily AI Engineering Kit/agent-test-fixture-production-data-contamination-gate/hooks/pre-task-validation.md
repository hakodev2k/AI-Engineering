# Hook: Pre-task Validation

**Trigger:** before fixture investigation or editing.

**Preconditions:** package copied intact; Python 3.10+ available.

**Action:**

```bash
python3 scripts/validate-config.py --config config/fixture-contamination.json
```

Then confirm the supplied repository root exists before scanning.

**Expected result:** exit code 0 and `config valid`.

**Failure behavior:** capture stderr and stop. Do not edit fixtures with an invalid policy.

**Blocking:** yes.