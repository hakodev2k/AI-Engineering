# Engineering Rules

## MUST

- MUST capture a baseline ref and protected-oracle path set before implementation on high-risk work.
- MUST treat tests, snapshots, fixtures, golden files, test discovery config, and CI test filters as security-relevant verification artifacts when they affect completion.
- MUST generate the final audit from the complete diff against baseline.
- MUST require explicit approval for protected-oracle changes when policy enables it.
- MUST run an independent verifier for high-risk changes and for any accepted oracle-semantic change.
- MUST preserve failing evidence and known baseline failures; classify them rather than hiding them.
- MUST re-run verification after the last implementation or oracle change.
- MUST distinguish `implemented`, `visible-tests-pass`, and `behavior-verified`.
- MUST stop after the configured remediation limit and report blocked/incomplete.

## MUST NOT

- MUST NOT add skip/ignore/disable markers merely to obtain a green suite.
- MUST NOT delete or weaken assertions merely because the implementation fails them.
- MUST NOT rewrite expected outputs, snapshots, fixtures, or golden files to match new behavior without an explicit requirement and approval.
- MUST NOT reduce test discovery, exclude failing tests, lower quality thresholds, or enable `continue-on-error` as a hidden workaround.
- MUST NOT count an implementation-agent explanation as approval for its own high-risk test changes.
- MUST NOT treat a green mutable suite as sufficient proof when protected or held-out verification is required.
- MUST NOT give the implementation agent write access to held-out verification artifacts when isolation is technically available.
- MUST NOT weaken the guard after a finding just to unblock completion.

## SHOULD

- SHOULD keep implementation and verifier workspaces separate for high-risk changes.
- SHOULD use integration/E2E or held-out checks that exercise acceptance criteria not fully represented by visible unit tests.
- SHOULD use test-impact analysis to choose relevant regression tests without silently dropping broad verification.
- SHOULD record why each legitimate oracle change is necessary and what independent evidence confirms the new oracle.
- SHOULD track visible-pass/held-out-fail rate, protected-file change rate, false-positive review rate, and escaped regressions over time.
- SHOULD prefer deterministic diff checks to prompt-only instructions for oracle integrity.
