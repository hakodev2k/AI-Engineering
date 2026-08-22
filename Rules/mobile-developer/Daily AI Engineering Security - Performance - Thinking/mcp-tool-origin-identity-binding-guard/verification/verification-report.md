# Verification Report

## Scope
Verify that the package consistently binds MCP tool registration, approval, policy lookup, dispatch, and audit records to the same host-controlled identity.

## Evidence review
Current public sources support the engineering problem:
- MCP 2026-07-28 tools specification says tool names are unique only within a server, aggregated clients may encounter collisions, and `serverInfo.name` is not guaranteed unique.
- MCP issue #1395 documents naming-normalization and concatenation ambiguity across clients.
- Claude Code issue #28093 reports concurrent sessions routing a call to the wrong MCP server process/project.
- MCP issue #3180 identifies cross-server tool-name shadowing as a design gap.

The sources support the problem class; they do not establish that every MCP implementation is affected.

## Verification matrix
| Scenario | Package control | Expected result |
|---|---|---|
| Two servers expose the same protocol tool name | Host instance ID + origin fingerprint + distinct alias | Both remain distinguishable |
| One display alias resolves to two identities | Catalog audit | Candidate catalog rejected |
| Aliases collide after normalization | Catalog audit | Candidate catalog rejected |
| Two server-reported names are identical | Host-controlled instance IDs | No identity merge |
| Connection/process changes | Connection generation | Previous decision no longer matches |
| Input schema changes | Schema digest | Previous identity no longer matches |
| Configured remote/stdio origin changes | Origin fingerprint | Previous identity no longer matches |
| Approval and live registry differ | Pre-dispatch comparison | Invocation not dispatched |

## Implemented
- Deterministic canonical identity derivation.
- Host-controlled server instance ID requirement.
- Trusted transport-origin fingerprinting for stdio and HTTP-family transports.
- Input-schema digest binding.
- Connection-generation binding.
- Exact approval/live identity comparison.
- Catalog checks for ambiguous aliases, normalization collisions, inconsistent canonical IDs, multiple live generations, and reused server-reported names.
- Enforceable rules, delegated roles, bounded workflows, hooks, and regression tests.

## Measured
No production MCP host was provided for this run. Production collision frequency, runtime overhead, mismatch frequency, and operational impact are therefore not measured here.

Recommended measurements:
- registry entry count,
- ambiguous alias rejection count,
- normalization collision rejection count,
- stale generation rejection count,
- origin mismatch rejection count,
- schema mismatch rejection count,
- approval-to-dispatch identity match ratio,
- catalog validation duration.

## Verified in this run
- Evidence and package scope are consistent.
- Required package components reference concrete generated paths.
- Scripts contain executable implementations rather than pseudocode.
- Identity ambiguity is handled with fail-closed rules and no fuzzy fallback.
- Implementation and independent verification responsibilities are separated.
- Package content contains no credentials or destructive operational commands.

## Not claimed as verified
- The scripts were not executed inside a target MCP host because no target runtime integration was supplied.
- Production effectiveness is not claimed until the host adapter performs the identity comparison immediately before the concrete transport call.
- Performance impact is not claimed until measured in the integrating environment.

## Required target-environment verification
1. Run `python -m unittest discover -s tests -v` from the package root.
2. Register two test servers exposing the same tool name with distinct origins and verify they resolve only through distinct identities/aliases.
3. Create an alias collision and verify catalog admission rejects it.
4. Approve generation N, reconnect as generation N+1, and verify the older record cannot be used for dispatch.
5. Change a tool schema while retaining the same visible name and verify the older identity does not match.
6. Change configured origin and verify the older identity does not match.
7. Instrument the dispatcher and verify approval and dispatch canonical IDs match for every allowed test call.
8. Confirm audit logs contain identity metadata while excluding credentials and sensitive headers.

## Definition of Done
Integration is complete only when all current entries have canonical IDs; no ambiguous alias is model-visible; approval/policy stores use canonical IDs; stale generation/schema/origin fixtures are rejected; duplicate protocol names across distinct servers remain usable through explicit aliases; the dispatcher does not re-resolve by display name; required tests pass; metrics are collected; and no blocking finding remains.

## Failure policy
Detection: nonzero guard/auditor result, identity mismatch, or unexpected-origin evidence.

Evidence: preserve registry snapshot, approval record, dispatcher identity, and connection generation.

Retry: at most one fresh registry refresh for stale metadata; no automatic switch to another origin.

Fallback: disable the affected identity/alias until an unambiguous mapping is restored.

Escalation: operator/security owner when origin cannot be proven or external effects require review.

Stop condition: keep the affected tool disabled until identity continuity is independently verified.