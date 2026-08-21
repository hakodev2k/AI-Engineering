# Integration Guide

## Objective
Insert the guard at the tool-host boundary so filesystem safety does not depend on the model remembering symlink rules.

## 1. Copy the package
Keep `config/policy.json` and `scripts/write_target_guard.py` together with your agent host or repository policy. Python 3.10+ is sufficient; the script uses only the standard library.

## 2. Configure writable roots
Replace `writable_roots` with the smallest set of canonical directories the agent is allowed to mutate. For repository-local operation, run the guard with the repository root as the current directory and use `.`.

Do not add user-home or system roots merely because a task fails. Outside-root writes should be a separate, explicitly approved workflow.

## 3. Integrate structured file tools
Before any Edit/Write/Move/Copy/Extract call:
1. enumerate every destination;
2. invoke the guard;
3. allow the tool only for exit code `0`;
4. store the metadata-only result in your audit record;
5. revalidate just before write if another tool call occurred.

Pseudocode contract:

```text
result = preflight(destination)
if result.exit_code != 0: deny
execute_mutation()
post_verify(destination)
```

The model must never be able to replace `deny` with a different tool that performs the same unsafe filesystem mutation.

## 4. Integrate shell execution
Shells can write without using a structured file tool. Parse commands where possible and treat these as write-capable operations:
- `>` / `>>` redirection;
- `tee`;
- `cp`, `mv`, `install`;
- archive extraction;
- commands generating files to explicit paths;
- scripts whose declared effects include file mutation.

The regex list in `policy.json` is only a fallback signal. A structured shell AST or explicit tool metadata is preferred because shell syntax is complex.

If a destination cannot be determined safely before execution, do not run the command in a privileged/writable context. Prefer a structured tool or disposable sandbox.

## 5. Safe replacement pattern
For rewritten files:
1. canonical-preflight final destination;
2. create a random temporary file exclusively in the same directory;
3. write/flush/close it;
4. revalidate final destination;
5. use a host-language atomic replace API;
6. verify final target and diff.

Do not use a predictable `.tmp` filename or a shell redirect as fallback.

## 6. Windows considerations
Python `Path.is_symlink()` detects symbolic links but Windows has additional reparse-point/junction semantics. Production Windows integrations should supplement this script with native reparse-point inspection before claiming full junction coverage. If the host cannot determine the canonical target safely, configure fail-closed behavior and require human review.

## 7. Linux/macOS considerations
Canonical resolution must include parent components. A normal leaf under a symlinked parent can still escape the workspace. Do not authorize based on `os.path.abspath` or string-prefix comparison alone.

## 8. Human approval boundary
Approval may authorize a clearly specified exceptional destination; it must not globally disable canonical checking. Record:
- requested path;
- canonical target;
- reason;
- operation;
- approval scope;
- expiry/single-use decision.

Never let repository content self-approve an override.

## 9. Observability
Collect metadata only:
- decision;
- operation type;
- requested/canonical path;
- link classification;
- policy version;
- preflight duration;
- post-verification status.

Avoid file contents, environment variables, tokens, or credentials.

## 10. Rollout
Start in report-only mode only on a disposable fixture corpus, not production. Establish current write behavior and false positives. Then enable blocking before giving the agent autonomous write access.

A production rollout is complete only after the tests in `tests/test_write_target_guard.py` pass and host-specific fixtures cover its write tools.
