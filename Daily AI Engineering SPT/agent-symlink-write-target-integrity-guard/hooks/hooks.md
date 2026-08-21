# Hooks

## Hook 1 — PreToolWrite Target Check
**Trigger:** before Edit/Write/Move/Copy/Install/Extract or any structured tool declares a destination path.

**Action:** run canonical-target validation against each destination.

**Command:**
`python scripts/write_target_guard.py <target> --policy config/policy.json`

**Expected result:** exit `0` and JSON status `pass`.

**Failure behavior:** exit `2/3/4` blocks the mutation. Do not auto-add writable roots. One metadata refresh/retry is permitted only for a transient resolution error.

## Hook 2 — PreShell Write Detection
**Trigger:** before executing a shell command.

**Action:** if the host parser identifies redirection or a configured write primitive, extract/resolve intended destinations and run the guard. As a fallback signal, pass the command into the guard's configured pattern detector.

**Command example:**
`python scripts/write_target_guard.py <target> --policy config/policy.json --command '<command>'`

**Expected result:** every destination has an explicit preflight result before shell execution.

**Failure behavior:** unresolved destination or blocked target prevents execution. Require a safer structured tool or human review instead of shell-bypass techniques.

## Hook 3 — PrePromotion Revalidation
**Trigger:** immediately before renaming/replacing a generated temporary file into its final destination.

**Action:** repeat canonical target and link-state checks because state may have changed since initial preflight.

**Expected result:** destination parent and leaf classification match the approved plan.

**Failure behavior:** abort promotion; remove only the temporary file created by this workflow; preserve suspicious destination metadata.

## Hook 4 — PostWrite Integrity Check
**Trigger:** after a successful mutation.

**Action:** resolve final target, confirm it is within the allowed canonical root, inspect file type, and inspect `git status`/`git diff` when applicable.

**Expected result:** intended destination only; no outside-root or protected-path mutation; expected diff.

**Failure behavior:** stop subsequent writes and enter the incident workflow. Do not try to repair by repeating the same write.

## Hook 5 — Final Verification Gate
**Trigger:** before the agent reports task completion.

**Action:** confirm all write operations have a pass record and all post-write checks succeeded. Run regression fixtures when the host integration changed.

**Expected result:** no unresolved target-integrity violations, no unverified overrides, and evidence for Implemented/Measured/Verified state.

**Failure behavior:** completion is blocked until the violation is resolved or explicitly escalated.
