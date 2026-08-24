# Hook: Post Edit Case Portability Check

## Trigger

After a task creates, renames, moves, regenerates, or edits source files/import references.

## Preconditions

Repository root and package policy are readable.

## Action

```bash
python scripts/case_portability_gate.py --root . --policy config/policy.json --output .artifacts/case-portability-report.json
```

When the package is vendored under another path, adjust only the script/policy paths; keep `--root .` pointed at the target repository.

## Expected result

Exit code `0`, report status `pass`.

## Failure behavior

Exit `2`, `4`, or `5` blocks completion of the editing stage. Preserve the report and invoke the diagnosis skill. Do not automatically rewrite filenames.

## Blocking

Yes for blocking findings, invalid configuration, or scanner failure.