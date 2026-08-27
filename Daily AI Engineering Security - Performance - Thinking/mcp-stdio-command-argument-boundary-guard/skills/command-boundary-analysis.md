# Skill: MCP stdio Command Boundary Analysis
## Purpose
Determine whether an MCP stdio launch is authorized as a complete parsed invocation rather than merely by executable name.

## Trigger
New/changed MCP server configuration, remote MCP registration, command-policy change, or security review.

## Inputs
Server identity, transport, executable, argv, policy, caller trust level.

## Preconditions
The proposed command has not been executed. Arguments are available as a structured array.

## Required context
Only launch configuration and policy. Credentials are not required.

## Allowed tools
Read-only configuration inspection and `scripts/command_guard.py`.

## Constraints
MUST NOT invoke a shell to normalize or test the command. MUST NOT execute the proposed server during authorization.

## Procedure
1. Record server identity and provenance.
2. Reject command strings; require executable plus argv.
3. Compare executable and required argv prefix with server-bound policy.
4. Detect interpreter-execution flags and shell metacharacters.
5. Validate bounded extra arguments against configured regex.
6. Produce Facts, Evidence, Decision, Risks, Verification status.
7. Hand off blocked cases for independent review.

## Decision points
Any mismatch or ambiguous parsing blocks process creation.

## Expected output
Machine-readable allow/block decision and normalized invocation.

## Metrics
Exact-contract coverage, blocked unsafe launches, false positives, policy exceptions.

## Verification
Independent reviewer runs malicious fixtures and confirms no shell re-parsing path exists.

## Failure handling
Fail closed; disable the server if policy cannot represent the intended launch safely.

## Stop conditions
Stop after one deterministic evaluation plus at most two policy corrections; shell interpretation requires escalation.
