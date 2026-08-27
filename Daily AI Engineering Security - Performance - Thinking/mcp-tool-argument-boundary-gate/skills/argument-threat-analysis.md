# Skill: MCP Tool Argument Threat Analysis

## Purpose
Map LLM-controlled tool fields to command, network, filesystem, credential, and data-exfiltration sinks.

## Trigger
New MCP tool, changed tool schema, new privileged sink, security advisory, or prompt-injection exposure.

## Inputs
Tool schema, implementation call graph, credentials attached by the server, allowed roots or hosts, sample calls.

## Preconditions
Tool identity and side-effect class are known.

## Required context
Only tool implementation, policy, and observed call envelopes; retrieved content remains untrusted.

## Allowed tools
Read-only code inspection, static analysis, unit tests, deterministic guard.

## Constraints
MUST fail closed on unknown tools. MUST NOT expose secrets in test fixtures. MUST NOT treat schema validation as sink validation.

## Procedure
1. Enumerate tool arguments and trace each to its sink.
2. Classify sinks: command/process, network, filesystem, credential-bearing, or pure data.
3. Define sink-specific invariants such as argv safety, host allowlist, and canonical path root.
4. Encode invariants in `config/tool-argument-policy.json`.
5. Run adversarial fixtures with injection, endpoint redirection, traversal, and symlink cases.
6. Verify the implementation uses equivalent canonicalization or allowlist semantics before side effects.
7. Record residual risks and required human approval.

## Decision points
Block when a sink cannot be constrained deterministically or when credential destination is caller-controlled.

## Expected output
Facts, sink map, trust boundaries, policy, violations, residual risk, verification status.

## Metrics
Unsafe fixture block rate, false-positive rate, unknown-tool deny rate, credential-destination violations, path-boundary violations.

## Verification
Independent reviewer confirms each dangerous sink has an enforceable invariant and regression fixture.

## Failure handling
Disable the tool or run it under a narrower sandbox and credential scope until a safe invariant exists.

## Stop conditions
Any secret exposure, path escape, command-injection path, or unreviewed privileged sink blocks completion.
