# Integration Guide

## Goal

Integrate the guard around an AI coding agent so test/oracle changes become privileged, visible actions rather than ordinary workspace edits.

## Recommended boundary

```text
User requirement
  -> baseline capture
  -> implementation agent
  -> complete git diff
  -> oracle_guard.py
       -> clean: continue
       -> findings: independent review / approval
  -> protected + regression verification
  -> final fresh audit
  -> completion gate
```

## 1. Place the package

Copy this package into a repository tooling folder or CI utility repository. Python 3.10+ is recommended; `scripts/oracle_guard.py` uses only the standard library.

## 2. Customize protected paths

Edit `config/oracle-policy.json`. Include every file class that can change the meaning or execution of tests in your repository, not just `tests/`.

For a .NET repository, commonly add patterns for:

- `**/*Tests/**`
- test `.csproj` files
- `.runsettings`
- snapshot/golden-data folders
- `Directory.Build.props` / `Directory.Build.targets` when they affect test selection
- CI workflows that invoke `dotnet test`

For JS/TS, include Jest/Vitest/Playwright config and snapshots. For Python, include `pytest.ini`, `pyproject.toml`, fixtures, and conftest files.

## 3. Capture baseline before agent writes

Persist:

- baseline commit SHA or working-tree fingerprint;
- acceptance criteria;
- protected path inventory;
- baseline test command and result;
- known failures;
- verifier-only checks if available.

Do not tell a held-out test's exact assertions to the implementation agent when secrecy is part of the verification design.

## 4. Run the implementation agent

Give the implementation agent production-code write access. Where the platform allows it, make verifier-only artifacts read-only or unavailable.

A legitimate request to update a test should be returned as a separately reviewable proposal rather than silently mixed into a “fix.”

## 5. Audit the full diff

```bash
git diff --no-ext-diff <baseline-sha> -- > agent-final.diff
python scripts/oracle_guard.py \
  --diff agent-final.diff \
  --policy config/oracle-policy.json \
  --report oracle-report.json
```

Exit `0` means no configured finding. Exit `2` means review is required. Exit `3` means invalid policy/input. Exit `4` means I/O failure.

## 6. Approve legitimate protected changes explicitly

After an independent reviewer accepts a legitimate test change, pass exact approved paths:

```bash
python scripts/oracle_guard.py \
  --diff agent-final.diff \
  --policy config/oracle-policy.json \
  --approved-path tests/auth/test_login.py \
  --report oracle-report.json
```

Approval only removes the unapproved-path finding. It intentionally does **not** suppress weakening-pattern or assertion/test-count findings; those still require review and evidence.

## 7. Verify behavior independently

For high-risk work, run verification from a clean checkout/worktree or CI runner controlled by a verifier identity. Prefer:

1. focused tests for the requested behavior;
2. impacted regression tests;
3. broader suite appropriate to risk;
4. protected/held-out/integration/E2E checks that exercise the actual acceptance criteria.

If the visible suite passes but independent behavior fails, route to Workflow C in `workflows/workflows.md` rather than changing verifier expectations.

## 8. Re-run after the last edit

Any code or oracle edit invalidates earlier final evidence. Regenerate the complete diff, rerun the guard, then rerun required behavioral checks.

## CI example

A CI pipeline can:

1. diff the agent branch against its base SHA;
2. run `oracle_guard.py`;
3. upload `oracle-report.json` as a review artifact;
4. require a protected approval job for test-semantic changes;
5. execute verifier-only test jobs;
6. block merge if any mandatory stage fails.

## Handling false positives

Static heuristics are deliberately conservative. A finding means **review required**, not “the agent cheated.” Track dispositions and tune path/pattern configuration when a repeated benign pattern creates noise, but do not globally disable a class of checks merely to make the pipeline green.

## Human approval boundary

Require explicit human approval before:

- accepting deleted protected tests;
- lowering coverage/quality thresholds;
- changing CI test filters;
- modifying held-out or security-critical expected behavior;
- using a workaround that intentionally reduces verification scope.

## Rollout

Start in report-only mode for several representative agent tasks to measure baseline protected-change frequency and false positives. Then enable blocking for unapproved protected changes and known weakening patterns. Finally add verifier-only/held-out checks for high-risk workflows.
