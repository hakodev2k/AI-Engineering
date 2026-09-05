# Skill: MCP Instruction Threat Model

## Purpose
Map how server-authored natural language enters model context and whether it can influence privileged tools or host policy.

## Trigger
New MCP connector; protocol/SDK upgrade; changed server instructions/tool descriptions; high-impact tool addition; prompt-injection finding.

## Inputs
MCP initialize/discover payloads, tool descriptions, client prompt assembly code, tool-permission policy, credential scopes, approval rules, runtime logs.

## Preconditions
Read-only inspection is sufficient for discovery. Dangerous tool calls are prohibited during diagnosis.

## Required context
Source/provenance of each text segment; destination prompt/context class; effective tool permissions; approval boundary.

## Allowed tools
Source/config readers, safe MCP clients, static scanners, this package's inspection script, unit/integration tests.

## Constraints
Do not expose secrets in test fixtures or logs. Do not weaken tool permissions to reproduce an injection.

## Procedure
1. Enumerate every server-authored text field that reaches the model.
2. Label provenance and trust class before concatenation.
3. Record whether the field enters system/developer/user/tool-result/untrusted-data context.
4. Inventory capabilities available after ingestion, especially repo write, shell, filesystem write, browser action, cloud mutation, and secret access.
5. Establish baseline with benign and hostile fixtures.
6. Run `inspect_mcp_instructions.py` on captured instruction payloads.
7. Determine whether a blocked/hostile payload can still alter permissions or approval behavior through another path.
8. Form root-cause hypothesis and validate against prompt assembly and authorization code.
9. Design the smallest change that preserves provenance and enforces authorization externally.
10. Hand implementation evidence to an independent Security Verifier.

## Decision points
- Server text in privileged host instruction region: BLOCK.
- Server text can change permission/approval state: BLOCK.
- Provenance unknown: BLOCK.
- Benign text isolated as untrusted data with external authorization intact: continue.

## Expected output
Trust-boundary map, facts/evidence, attack path, root cause, remediation requirements, verification status.

## Metrics
Zero server-authored text in privileged host regions; zero permission changes derived from server text; 100% hostile fixtures blocked or isolated; zero secret exposures.

## Verification
Independent reviewer reproduces hostile fixtures and confirms backend authorization is unchanged.

## Failure handling
Retry ambiguous provenance tracing at most twice. Missing evidence is not evidence of safety.

## Stop conditions
Stop immediately on confirmed privilege escalation, secret access, or approval bypass. Stop after two unresolved provenance attempts and escalate.