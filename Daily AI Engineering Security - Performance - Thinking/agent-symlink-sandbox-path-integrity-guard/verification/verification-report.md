# Verification Report

## Status model
This package distinguishes **Implemented**, **Measured**, and **Verified**. Generated tests are not automatically passed tests, and policy deployment alone is not proof that an attack path is blocked in a target runtime.

## Implemented
- Evidence-backed threat model for symlink/canonical-path confusion.
- Configurable writable and protected roots.
- Deterministic preflight path evaluation.
- Lexical + canonical path recording.
- Symlink transition recording and depth limit.
- Protected-root and outside-root denial.
- Parent/target identity capture.
- Commit-time identity revalidation.
- Metadata-only workspace alias scanner.
- Git `gitdir` review signal.
- Bounded retry/stop rules.
- Incident containment workflow.
- Adversarial unit tests for the primary documented failure modes.

## Static verification completed during package generation
- Required package files contain complete implementation rather than placeholders.
- Both Python scripts are runnable implementations rather than pseudocode.
- Tests use disposable temporary directories, not real user/runtime protected paths.
- Deny decisions return non-zero exit codes.
- Allowed decisions require canonical target containment in a configured workspace root.
- Protected-root matching occurs after canonical resolution.
- Commit-check compares parent identity and canonical target to the preflight record.
- Scanner does not recursively follow directory symlinks and does not execute repository content.

## Runtime verification command
Run from the topic directory:

```bash
python -m unittest tests/test_path_integrity_guard.py
```

Expected assertions:
1. normal in-root new file => allow;
2. in-root symlink => allow when policy enables it;
3. relative symlink escape => deny;
4. absolute symlink escape => deny;
5. protected-root alias => deny;
6. broken symlink write => deny;
7. parent replacement after preflight => commit-check deny;
8. scanner flags outside-root link;
9. scanner does not block safe in-root link.

## Runtime execution status for this generation run
A direct local clone/test attempt could not execute because the available container environment could not resolve `github.com`. This is an environment/network limitation, not a recorded test pass or failure. The package therefore does **not** claim target-runtime regression execution during generation.

## Measured metrics required in integration
- guard latency p50/p95;
- denied checks / total checks;
- identity drift detections;
- protected-root attempts;
- scanner duration and alias counts;
- false-positive exception count;
- outside-root successful mutations (target: 0).

## Verified criteria for deployment
Mark a target integration `Verified` only when all are true:
- regression tests pass on each supported OS/filesystem mode;
- an adversarial outside-root sentinel remains unchanged;
- protected runtime/config fixtures cannot be reached through workspace aliases;
- legitimate configured symlinked workspaces still function;
- shell/patch/Git mutation paths are routed through equivalent enforcement or bounded by an OS sandbox;
- no unbounded retry or silent security downgrade exists;
- an independent reviewer confirms the implementing component is not its sole verifier.

## Failure handling
If any security fixture writes outside the intended root, stop deployment. Preserve fixture state and decision logs, fix the boundary, then rerun the entire suite. Never weaken protected roots, canonical checks, or commit-time revalidation merely to pass tests.

## Package-generation Definition of Done
- Evidence documented: complete.
- Existing approaches/limitations documented: complete.
- Skills/rules/subagents/workflows/hooks implemented: complete.
- Deterministic scripts provided: complete.
- Regression tests provided: complete.
- Runtime target measurements: intentionally not claimed by generation environment.
- GitHub manifest verification: required before final success response.
