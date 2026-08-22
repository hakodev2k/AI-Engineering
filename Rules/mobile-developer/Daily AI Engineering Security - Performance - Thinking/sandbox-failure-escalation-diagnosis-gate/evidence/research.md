# Research Evidence

## Topic
Sandbox Failure Escalation Diagnosis Gate

## Category
Thinking

## Problem
Coding agents may treat a sandboxed command/tool failure as evidence that the requested operation needs broader permissions. When the actual cause is a broken helper, host sandbox incompatibility, inaccessible temporary directory, or approval-review timeout, retrying with escalation can create repeated approvals/model calls without addressing the root cause.

## Why it matters now
Auto-review and long-running autonomous coding loops make escalation cheaper to trigger and less visible to the user. A wrong causal inference can therefore repeat dozens or hundreds of times before a human notices.

## Affected users
Coding-agent users, Windows/Linux developers, platform teams using auto-review, and maintainers of sandboxed tool runtimes.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39408 reports two affected days where repeated sandbox/tool failures converted workspace-local operations into large volumes of `codex-auto-review` calls. On Aug. 13, 113 of 198 recovered review turns were `apply_patch` sandbox-failure retries; 197/198 reviewer decisions allowed the operations. The report explicitly describes a feedback loop: local operation → tooling failure → infer escalation → auto-review → allow → repeat.
2. Codex issue #29908 shows `apply_patch` and ordinary managed commands failing before the requested operation due to Bubblewrap/user-namespace/network-namespace setup problems, even though the repository permissions themselves were not the cause. The suggested remedy is a supported fallback/diagnostic path rather than assuming a need for broader repository permissions.
3. Codex issue #24204 reports escalation approval timeouts for a CLI needing macOS Keychain access; the error explicitly warns not to infer the action is unsafe from timeout alone and recommends at most one retry or explicit guidance.

### Interpretation
The recurring engineering weakness is causal classification. “Sandbox execution failed” is an observation, not a proof that the requested resource boundary is too narrow. Escalation should require evidence that the requested operation actually crosses an allowed boundary, or a validated fallback contract, rather than being the default response to any sandbox/runtime failure.

## Existing approaches
- Retry outside sandbox after a sandboxed command fails.
- Auto-review/guardian approval for escalated execution.
- User approval prompts.
- Restarting or repairing the sandbox/runtime.
- Per-tool workarounds and fallbacks.

## Remaining limitations
- Failure reason is often collapsed into a generic “command failed; retry without sandbox?” path.
- Repeated identical failure classes may trigger new model/approval decisions each time.
- Agent loops may lack an explicit hypothesis test distinguishing boundary denial from helper/runtime failure.
- Auto-review can hide abnormal escalation volume.
- Safe in-workspace fallbacks are not always attempted before privilege expansion.

## Root-cause analysis
1. Permission escalation is used as a recovery heuristic rather than an evidence-backed decision.
2. Failure signatures are not correlated across repeated operations.
3. No circuit breaker limits repeated escalation for the same failure class.
4. No structured decision record separates Facts, Assumptions, Hypotheses, Evidence, Decision, and Verification status.
5. Approval success is mistaken for remediation success even when the original failure class persists.

## Improvement opportunity
Introduce an observable diagnosis gate before escalation: classify the failure, test whether the requested path/resource truly lies outside the declared sandbox boundary, correlate repeated signatures, attempt only safe bounded fallbacks, and require independent evidence before privilege expansion. Add a circuit breaker when repeated escalations fail to remove the original failure signature.

## Relevant sources
- https://github.com/openai/codex/issues/39408
- https://github.com/openai/codex/issues/29908
- https://github.com/openai/codex/issues/24204
