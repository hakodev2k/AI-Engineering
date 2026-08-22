# Skill: Untrusted Context Threat Modeling

## Purpose
Map how repository-controlled or externally retrieved content can influence an agent and cross into privileged tool execution.

## Trigger
Use before enabling a coding agent on unfamiliar repositories, external PRs/issues, new instruction-file conventions, auto-approved build/test tools, new network permissions, or credential-bearing environments.

## Inputs
- Context ingestion inventory.
- Tool inventory and side effects.
- Repository/source trust state.
- Sandbox/network/credential capabilities.
- `config/trust-policy.json`.
- Existing approval rules.

## Preconditions
Identify where context originates and where tool authorization is enforced. If provenance cannot be observed, treat affected context as untrusted.

## Required context
Prompt construction, tool router, approval layer, sandbox boundary, environment-secret handling, Git/GitHub permissions, network policy, and repository execution paths.

## Allowed tools
Read-only source inspection, security tests, deterministic policy checker, sandboxed fixtures, and logs with secrets redacted.

## Constraints
- MUST NOT execute malicious fixtures outside an isolated test environment.
- MUST NOT expose real secrets to tests.
- MUST NOT rely solely on prompt-injection detection/classification for enforcement.
- MUST preserve user-directed legitimate workflows when policy and approval permit them.

## Procedure
1. Inventory context sources: user prompt, system policy, repository files, filenames/paths, agent instruction files, issues/PRs, MCP instructions, web/RAG results.
2. Assign each source a trust level and immutable provenance label.
3. Inventory tools by impact: read-only, repository-code execution, network, credential access, workspace write, outside-workspace write, remote write, destructive action.
4. Draw trust crossings from each untrusted source to model context to proposed tool call to tool runtime.
5. For every crossing, ask whether provenance survives to the authorization decision.
6. Identify auto-approved tools that can execute attacker-controlled repository code indirectly (tests, builds, package scripts, task runners).
7. Identify combinations that are individually permitted but dangerous together, especially secret access + network or untrusted code + broad filesystem writes.
8. Encode deterministic rules in `config/trust-policy.json` and validate with `scripts/taint_gate.py`.
9. Add adversarial fixtures for repository instructions, filenames, test/build execution, external issue/PR content, and network/write actions.
10. Have a separate Security Reviewer verify the policy and negative tests.

## Decision points
- If untrusted influence is present and a high-impact tool would execute repository code, require approval unless policy denies it outright.
- If an action combines secret access and untrusted network influence, deny by default.
- If provenance is missing or ambiguous, fail closed to `require_approval` for high-impact tools.
- If a tool is genuinely read-only and cannot cause external side effects, allow according to policy while retaining audit metadata.

## Expected output
Threat model, trust-boundary map, policy changes, adversarial test matrix, and verified enforcement evidence.

## Metrics
Coverage of context sources, coverage of high-impact tools, blocked/approved negative fixtures, false-block rate, and number of tool decisions lacking provenance.

## Verification
All configured negative fixtures must return the expected deterministic decision and no test may use real credentials or external destructive actions.

## Failure handling
If provenance cannot be propagated, disable auto-approval for affected high-impact tools and escalate for integration work. Do not weaken the policy to accommodate missing telemetry.

## Stop conditions
Stop after one policy retry when expected security fixtures still fail; escalate to a human security owner. Stop immediately if a test escapes isolation or touches real credentials.
