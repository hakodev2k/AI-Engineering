# Hook: Pre-Release Render Budget

## Trigger
Before shipping conversation renderer, tool-output renderer, markdown/highlighting, Electron/Chromium, or virtualization changes.

## Preconditions
Baseline and candidate measurements were captured with an identical benchmark corpus and procedure.

## Action
Run:

```bash
python scripts/render_budget_guard.py --budgets config/budgets.example.json --measurements examples/measurements.example.json
python -m unittest tests/test_render_budget_guard.py
```

## Expected result
Both commands exit 0 and the report shows all absolute, growth-slope, and relative-regression checks passing.

## Failure behavior
Block performance verification and preserve the failing report for diagnosis.

## Blocking
Yes.