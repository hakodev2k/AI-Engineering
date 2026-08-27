# Research — Tool Approval Context Integrity Gate

**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Human/tool approval can be unsafe when the approval surface does not faithfully represent the exact leaf tool call, arguments, provenance, and consequences that will execute.

## Problem
Current agent frameworks can lose, default, or replace approval-relevant context between model output, protocol serialization, delegation, UI rendering, resume, and final execution. A user or policy engine may approve an incomplete or outer wrapper action while the runtime executes a different inner action or argument set.

## Why it matters now
Recent August 2026 issues show the same failure class across independent stacks: permission prompts can silently lose raw tool input, and delegated agent runs can hide the nested tool actually requiring approval. These are boundary-integrity problems, not merely UI polish.

## Affected users
Agent-framework maintainers, AI coding-agent users, platform teams building human-in-the-loop flows, operators delegating to subagents, and teams using destructive, financial, outbound-message, deployment, or credential-bearing tools.

## Current public evidence

### Observed evidence
1. Agent Client Protocol issue #1979, opened August 18, 2026, reports that `ToolCallUpdate.raw_input` can deserialize with `DefaultOnError` into `None`. A permission UI then cannot distinguish truly absent input from unparseable input, so an argument-free approval can be shown even though the agent sent arguments.  
   https://github.com/agentclientprotocol/agent-client-protocol/issues/1979
2. Mastra issue #20934, opened August 7, 2026, reports that an agent-as-tool wrapper can discard the nested approval payload and instead expose the outer delegate call. Approving the wrapper can execute the inner tool even though the user was not shown the inner tool name or arguments.  
   https://github.com/mastra-ai/mastra/issues/20934
3. GitHub Copilot CLI documentation states that tool approval behavior depends on the tool and how it is used, including arguments, and warns that bypassing manual approval increases the risk of unintended actions and data loss.  
   https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli

### Interpretation
The common root failure is that approval is treated as a boolean attached to a run step rather than as a cryptographically/deterministically bound decision over the exact executable leaf action. Display-layer robustness and delegation wrappers can therefore change or omit approval context without forcing the runtime to re-authorize.

## Existing approaches
- Human approval prompts around selected tools.
- Static `needsApproval` / `requireApproval` tool metadata.
- Tool allowlists and deny lists.
- UI cards containing tool name and input.
- Outer-agent or orchestration-level approval.

## Remaining limitations
- Missing/unparseable input may fail soft for session robustness but become unsafe for authorization.
- Delegation can substitute an outer tool identity for the actual privileged leaf tool.
- Approval UIs can omit dynamic consequence data.
- A previously approved call can drift before execution unless approval is bound to a stable fingerprint.
- Allowlisting a tool name does not prove its actual arguments or destination are unchanged.

## Root-cause analysis
1. Approval state is not always bound to immutable executable data.
2. Serialization layers may default malformed fields instead of surfacing integrity loss.
3. Delegation wrappers can collapse nested provenance.
4. Approval and execution may occur at different abstraction layers.
5. Runtime checks often trust UI state instead of recomputing the approved action fingerprint.

## Improvement opportunity
Introduce a deterministic approval envelope and execution gate. The request phase canonicalizes leaf tool identity, parsed arguments, delegation chain, consequence class, and destination; computes a SHA-256 fingerprint; and requires the user/policy approval to bind to that fingerprint. The execution phase recomputes the fingerprint from the actual call and fails closed on mismatch, missing arguments, hidden nested tools, or missing consequence context for high-risk actions.

## Goal
Make an approval verifiably mean: “this exact leaf action, with these exact arguments and consequences, is approved.”

## Metrics
- Approval-envelope completeness rate.
- Fingerprint mismatch block count.
- Missing/unparseable argument block count.
- Nested leaf-tool visibility rate.
- High-risk consequence-summary coverage.
- Regression-test pass rate.

## Trigger
Any approval-bearing tool call, especially delegated, destructive, financial, external-write, deployment, or credential-bearing calls.

## Inputs
Leaf tool name, raw/parsed arguments, source/delegation chain, consequence class, destination/scope, human/policy decision, approved fingerprint.

## Outputs
Canonical approval envelope, fingerprint, allow/block decision, machine-readable reasons, audit record without secrets.

## Relevant sources
- ACP #1979: https://github.com/agentclientprotocol/agent-client-protocol/issues/1979
- Mastra #20934: https://github.com/mastra-ai/mastra/issues/20934
- GitHub Copilot CLI tool approval documentation: https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli
