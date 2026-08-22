# Research — Approval Sandbox Placement Contract Gate

## Topic
Approval Sandbox Placement Contract Gate

## Category
Security

## Problem
Agent runtimes can conflate two separate security decisions: whether a command requires approval and where that command executes. A command may be policy-approved but still silently remain sandboxed, or a no-prompt allow rule may imply sandbox escape even when the user intended only to suppress approval. When denied-read restrictions exist, naïve unsandboxing would also discard the credential boundary.

## Why it matters now
Recent Codex reports show this policy ambiguity is active in current agent tooling. Issue #38318, opened 2026-08-13 and updated 2026-08-20, reports `allow` rules that still execute in the sandbox whenever any denied-read restriction is active, with no diagnostic explaining that the requested placement cannot be honored. Issue #33349, opened 2026-07-15, independently reports that any filesystem deny rule prevents approved sandbox escalation. Related public requests have asked for approval/review policy and sandbox placement to become independent controls.

## Affected users
Developers using coding agents with host-only CLIs, teams protecting credentials with denied-read paths, enterprise policy authors, agent-runtime developers, and users who need selected trusted commands to access host resources without granting broad full access.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38318 documents an execpolicy `allow` result that remains sandboxed under denied-read restrictions. The reporter traced current execution paths and emphasizes that simply removing the safety check would discard denied-read protections. The requested direction is either a trusted host-side broker or an independent sandbox-placement policy that preserves the security boundary.
   - https://github.com/openai/codex/issues/38318
2. OpenAI Codex issue #33349 independently reports that any filesystem deny rule prevents leaving the sandbox after approval and asks for a way to define the profile to which execution escalates.
   - https://github.com/openai/codex/issues/33349
3. OpenAI Codex issue #20917 requests separation of permission/review policy from sandbox placement so that approval behavior and execution confinement can be configured independently.
   - https://github.com/openai/codex/issues/20917
4. OpenAI Codex issue #26108 describes the inverse usability/safety tension: users want trusted commands to run without repeated prompts while retaining sandbox confinement, rather than turning an allow rule into an implicit sandbox bypass.
   - https://github.com/openai/codex/issues/26108

### Interpretation
The evidence does not mean approval or sandboxing is universally broken. It shows a recurring policy-model problem: approval, sandbox placement, and filesystem confidentiality are distinct dimensions, but some configurations or rules make them interact implicitly. Silent fallback is particularly risky because the policy decision and effective execution environment can differ.

## Existing approaches
- Treat `allow`/approval as both authorization and sandbox-placement signal.
- Keep all commands sandboxed whenever denied-read restrictions exist.
- Ask users to approve escalation at runtime.
- Disable denied-read protections or use broad/full-access modes.
- Build an external trusted broker manually.

## Remaining limitations
Conflated policy cannot express common combinations such as “no prompt but remain sandboxed” or “approved host execution while preserving denied reads for the agent.” Silent fallback makes debugging and auditing difficult. Disabling denied reads weakens secret isolation. A generic unsandboxed process cannot preserve restrictions enforced only by the agent sandbox. Manual brokers are possible but lack a reusable policy contract and deterministic validation.

## Root-cause analysis
- Approval decision and execution placement are represented by one rule/decision path.
- Effective sandbox placement may be changed at runtime without being surfaced as a policy mismatch.
- Denied-read boundaries are tied to the sandbox implementation rather than represented as explicit invariants.
- Host-side trusted execution is not always modeled as a separate principal/capability.
- Policy validation often checks rule syntax, not whether requested approval/placement/confidentiality combinations are realizable.

## Improvement opportunity
Compile each command policy into three explicit dimensions: approval (`allow`, `ask`, `deny`), placement (`sandbox`, `host-via-broker`, `deny`), and confidentiality invariants (for example denied-read paths that MUST remain inaccessible to the agent). A deterministic pre-execution gate rejects impossible or unsafe combinations. Host execution is permitted only through an explicitly trusted broker profile that is separately allowlisted and whose accessible resources are declared; otherwise the gate keeps execution sandboxed or blocks with an actionable mismatch.

## Goal
Make the effective execution boundary explicit and prevent policy approval from silently changing or failing to change sandbox placement.

## Metrics
- 100% command decisions contain explicit approval and placement dimensions.
- 0 host executions occur without an approved broker profile when confidentiality invariants are active.
- 0 silent placement fallbacks in controlled tests.
- 100% denied-read fixtures remain protected from the agent execution context.
- Policy mismatch detection rate: 100% for known incompatible fixtures.

## Trigger
Policy compilation, agent startup, permission-profile change, rule reload, and immediately before any command that requests host execution or approval escalation.

## Inputs
Command identity/arguments, approval decision, requested placement, active confidentiality invariants, denied-read presence, broker identifier, broker capability declaration, and policy configuration.

## Outputs
`allow_sandbox`, `approval_required`, `broker_required`, `allow_broker`, or `deny`; effective placement; preserved invariants; blocking reasons; and audit evidence.

## Proposed solution
A secure-by-default placement contract with deterministic validation, a pre-execution blocking hook, a bounded policy-verification workflow, an independent security reviewer, and executable regression tests. It never resolves incompatibility by dropping denied-read or secret-protection rules.

## Relevant sources
- https://github.com/openai/codex/issues/38318
- https://github.com/openai/codex/issues/33349
- https://github.com/openai/codex/issues/20917
- https://github.com/openai/codex/issues/26108
