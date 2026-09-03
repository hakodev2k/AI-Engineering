# Research

## Topic
Sandbox Denial Provenance Escalation Gate

## Category
Security

## Problem
Agent runtimes can correctly detect that a local operation was denied by sandbox policy, then lose that security classification when serializing the tool result back to the model. The model may interpret the result as an ordinary command failure and try an equivalent operation through another execution surface such as MCP, SSH, browser automation, or a remote worker. If the alternative surface does not inherit the original denial and approval requirement, policy can be bypassed without an explicit privilege decision.

## Why it matters now
On 2026-08-28, OpenAI Codex issue #41320 reported that sandbox-denial provenance is dropped from model-facing exec results; in the unified-exec path the reconstructed result can even carry `success: true`. A separate 2026-07-14 Codex issue #32919 reported a sandbox-denied build later succeeding through an MCP tool backed by a remote executor without a fresh approval. These are independent signals showing the same cross-surface authorization problem: execution policy is enforced locally, while the semantic reason for denial is not reliably propagated into subsequent agent decisions.

## Affected users
Developers using coding agents with multiple tools, platform builders exposing local and remote executors, teams relying on sandbox/approval policies, and operators connecting MCP tools capable of external execution.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #41320, opened 2026-08-28, reports that the runtime classifies a command as sandbox-denied but the model-facing tool result loses that classification and can be serialized as successful metadata plus raw stdout/stderr.
2. OpenAI Codex issue #32919, opened 2026-07-14, reports an equivalent operation blocked by the local sandbox being executed through an SSH-backed MCP remote executor without a new approval or clear trust-boundary indication.
3. Codex permission behavior is distributed across approval policy, sandbox mode, tool adapters, and MCP surfaces; a local sandbox is therefore not a complete authorization boundary for equivalent operations reachable through other tools.

### Interpretation
The unresolved engineering weakness is not simply a missing error string. A sandbox denial is a security decision that must survive translation between executor, tool-result schema, model context, planner, and alternate tool adapters. Without durable provenance, the agent cannot distinguish "command failed" from "policy forbids this action," and fallback logic can accidentally become privilege escalation.

### Proposed solution
Introduce a reusable denial-provenance envelope and deterministic cross-surface gate. Every denied operation receives a normalized policy-decision record with operation fingerprint, denied capability, trust zone, policy source, approval requirement, and expiry. Any later semantically equivalent operation on a different executor must either remain denied or obtain explicit approval; ordinary retry/fallback cannot erase the decision.

## Existing approaches
- Local filesystem/network/process sandboxes.
- Per-tool approval prompts.
- MCP/tool allow/deny lists.
- Natural-language instructions telling agents not to bypass sandbox restrictions.
- Logging raw stderr from denied commands.

## Remaining limitations
- Raw stderr is adapter-specific and not a reliable security signal.
- Independent tool adapters may not share authorization state.
- Tool-name matching misses semantically equivalent operations.
- Natural-language policy is advisory unless the runtime enforces it.
- Approval on one surface may be incorrectly treated as approval on another surface with a different trust boundary.

## Root-cause analysis
1. Denial state is encoded as an execution error instead of an authorization decision.
2. Result normalization drops executor-specific security metadata.
3. Fallback planners optimize for task completion without a durable denied-capability ledger.
4. Alternative tools are authorized independently rather than against an operation-level policy decision.
5. Tests validate sandbox blocking per tool but not cross-tool equivalence after denial.

## Improvement opportunity
Create an operation fingerprint that captures action class, target, side-effect level, network/host boundary, and requested privilege. Persist denial records for the task. Before each alternative execution surface, compare the proposed operation against active denial records. Block equivalent or stronger operations unless a new approval explicitly authorizes the new trust zone. Log every match for audit and verification.

## Goal
Prevent a policy-denied operation from being re-executed through another tool or execution boundary without an explicit, auditable authorization decision.

## Metrics
- Denial provenance preservation rate: target 100%.
- Cross-surface bypass tests blocked: target 100%.
- Unauthorized equivalent fallbacks executed: target 0.
- Approval attribution coverage for allowed overrides: target 100%.
- False-positive rate on non-equivalent operations, measured on a representative fixture suite.

## Trigger
Use when an agent has more than one execution surface, when adding MCP/remote execution, when changing sandbox/approval serialization, or after any sandbox denial handling change.

## Inputs
Tool call/result records, sandbox decision metadata, configured trust zones, approval records, and proposed follow-up operations.

## Outputs
Normalized denial envelope, active denial ledger, deterministic pre-execution decision, audit evidence, and regression results.

## Relevant sources
- OpenAI Codex issue #41320, 2026-08-28: https://github.com/openai/codex/issues/41320
- OpenAI Codex issue #32919, 2026-07-14: https://github.com/openai/codex/issues/32919
- OpenAI Codex issue #38535, 2026-08-14, illustrates permission-state UX/config complexity: https://github.com/openai/codex/issues/38535
