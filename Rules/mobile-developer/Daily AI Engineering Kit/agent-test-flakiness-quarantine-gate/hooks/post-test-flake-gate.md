# Hook: Post-Test Flake Gate

## Trigger
A test command exits non-zero during an AI-assisted implementation, verification, CI-diagnosis, or test-fix-retest loop.

## Preconditions
The failing command and first failure output are available. A narrow test identifier can be derived without modifying repository state.

## Action
1. Persist the first failure before any rerun.
2. Stop generic retry behavior.
3. Invoke the Flake Investigator using `skills/triage-flaky-test.md`.
4. When a safe narrow selector exists, execute:
   `python scripts/run_flake_probe.py --test-id "<test-id>" --command "<narrow-test-command>" --config config/flake-gate.json`
5. Read the emitted `result.json` and route according to `workflows/flaky-test-gate.md`.

## Expected result
A bounded classification with preserved evidence; never an unbounded retry-to-green loop.

## Failure behavior
- Exit code 0: probe runs all passed; retain original failure evidence and continue verification cautiously.
- Exit code 2: flaky, consistent failure, or tool failure; block automatic task completion and route by status.
- Exit code 3/4: configuration or command-policy error; block the hook and require correction.

## Blocking
Yes. A failed original test cannot be silently cleared by a later passing rerun. Completion remains blocked until the workflow reaches evidence-based verification or an approved policy decision.
