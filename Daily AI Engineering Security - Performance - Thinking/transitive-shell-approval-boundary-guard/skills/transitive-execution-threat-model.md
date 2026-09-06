# Skill: Transitive Execution Threat Modeling

## Purpose
Determine whether an apparently allowed agent command can trigger unapproved effects through scripts, interpreters, package runners, subprocesses, or alternate tool surfaces.

## Trigger
Use before enabling or changing agent shell permissions, after a hook/permission bypass report, or when a command invokes code whose contents are not represented in the outer command string.

## Inputs
Command, working directory, agent/tool identity, permission policy, sandbox boundary, trusted roots, local script contents, and available execution telemetry.

## Preconditions
The reviewer can read the policy and inspect candidate local scripts without executing them.

## Required context
Declared user intent, protected paths/resources, irreversible actions, network policy, credential scope, and whether human approval is available.

## Allowed tools
Read-only filesystem inspection, static parsing, hashing, policy checker, test fixtures, and security logs. Dynamic execution is allowed only in a disposable sandbox with no production credentials or external write access.

## Constraints
Do not execute suspicious code merely to learn what it does. Do not weaken sandbox or approval settings to obtain a cleaner reproduction. Treat unresolved dynamic behavior as uncertainty, not evidence of safety.

## Procedure
1. Record the outer tool, literal command, cwd, identity, and currently applicable allow/ask/deny decision.
2. Enumerate direct execution edges: shell scripts, Python/Node/Ruby/PowerShell files, `-c`/`-e` inline code, package scripts, command substitution, `eval`, generated files, and subprocess launchers.
3. Resolve local paths canonically and mark whether each target remains inside a trusted root.
4. Hash inspectable script contents and capture the digest as evidence.
5. Classify potential effects: filesystem deletion/overwrite, permission changes, repository history mutation, process control, credential access, network egress, package installation, deployment, and remote command execution.
6. Compare those effects with the user-approved scope rather than the wrapper command.
7. Form a testable hypothesis for each suspected bypass, for example: 'the hook allows bash helper.sh because it sees only the wrapper while helper.sh contains a protected deletion'.
8. Reproduce using harmless fixtures that substitute sentinel files/directories for real resources.
9. Run `scripts/approval_guard.py` against benign and adversarial fixtures.
10. Require independent review when policy logic or high-risk findings change.

## Decision points
- **Allow** only when the effective chain is inspectable and no policy finding requires escalation.
- **Review** when code is dynamic, leaves trusted roots, invokes a secondary interpreter in an opaque way, or matches configured review rules.
- **Block** when a configured destructive primitive, remote-code execution pattern, or protected-path action is detected.

## Expected output
A structured decision, evidence digests, execution-edge summary, findings with reason codes, and verification status.

## Metrics
Detection rate on known bypass fixtures, benign pass rate, evaluation latency, unresolved-chain rate, and review escalation rate.

## Verification
A separate reviewer runs the fixture suite and confirms that the guard blocks transitive destructive examples while allowing benign scripts and preserving sandbox/permission boundaries.

## Failure handling
If parsing or path resolution fails, classify high-risk execution as review/block. Record the missing evidence. Do not retry more than twice without a changed hypothesis or new evidence.

## Stop conditions
Stop when the effective chain is sufficiently resolved for a policy decision, or when ambiguity remains after two bounded investigation attempts and human review is required.
