# Research — Cross-Session Agent Message Isolation Guard

## Topic
Cross-session message isolation and authority provenance for coding-agent workflows

## Category
Security

## Problem
Coding-agent runtimes increasingly expose peer/session discovery and messaging. In current Claude Code builds, workflow-spawned subagents can discover and message unrelated local sessions while the recipient sees the message as coming from the parent session; replies may route to the parent rather than the originating subagent. This breaks isolation, identity attribution, and authority provenance across concurrent workstreams.

## Why it matters now
On 2026-08-25, Claude Code issue #89453 reported a workflow subagent repeatedly messaging an unrelated interactive session and asking it to edit files in the parent's worktree. The report states that sender attribution and reply routing were both wrong. Earlier reports show the same subsystem has already required authority hardening and still has cross-session addressing/routing ambiguity.

## Affected users
- Developers running multiple coding-agent sessions on one machine.
- Teams using workflow/task subagents and cross-session coordination.
- Agent platform builders exposing ListAgents/SendMessage-like primitives.
- Security reviewers relying on session identity as an authorization boundary.

## Current public evidence
### Observed evidence
1. Claude Code issue #89453, opened 2026-08-25: workflow subagents could message unrelated sessions under the parent's identity; replies routed to the parent conversation. https://github.com/anthropics/claude-code/issues/89453
2. Claude Code issue #72051, opened 2026-06-28: unrelated user content appeared in another active conversation and was reported as a cross-session isolation failure. https://github.com/anthropics/claude-code/issues/72051
3. Claude Code issue #65784 documents a hardening change where relayed SendMessage content no longer carries user authority and notes that documentation did not fully describe the authority boundary. https://github.com/anthropics/claude-code/issues/65784
4. Claude Code issue #84768, opened 2026-08-07: asymmetric ListAgents/addressing and sender-name mismatch prevented reliable reply routing. https://github.com/anthropics/claude-code/issues/84768
5. Claude Code issue #84831, opened 2026-08-07: incoming cross-session messages are collapsed by default while the model consumes the full message, reducing human visibility of a security-relevant event. https://github.com/anthropics/claude-code/issues/84831

## Interpretation
The recurring failure is not merely UI confusion. Cross-session messaging is a distributed authorization surface. A message needs an unambiguous principal, session/workflow lineage, recipient, authority level, and reply route. If any field is inferred from mutable UI/session state, a child agent can be mistaken for its parent or an unrelated peer can become an implicit oracle.

## Existing approaches
- Per-message approval for cross-session messaging in some surfaces.
- Product hardening that strips user authority from relayed messages.
- Agent-team hierarchy and parent/teammate routing.
- UI labeling of peer messages.
- Manual convention: only message explicitly named peers.

## Remaining limitations
- Permission checks do not prove the discovered recipient belongs to the same workflow.
- Parent identity can obscure the actual child sender.
- Reply routing can diverge from display attribution.
- A same-user machine can host unrelated sessions with different trust and repository boundaries.
- Human approval becomes weak if the approval prompt lacks sender lineage, recipient workspace, and requested authority.

## Root-cause analysis
1. Discovery scope is broader than workflow membership.
2. Message identity is represented as a display name rather than a stable sender lineage tuple.
3. Authorization and routing are separate decisions but are not attested together.
4. Child-to-peer messaging inherits ambient parent capabilities instead of least privilege.
5. Cross-session messages are treated as conversational text even when they can influence code changes or permission decisions.

## Improvement opportunity
Introduce a host-side message gate that validates a message envelope before delivery. Default-deny child-to-unrelated-session traffic, bind sender identity to parent/workflow lineage, forbid relayed user authority, require explicit approval for cross-workflow delivery, and validate replies against the original message ID and sender/recipient pair.

## Proposed solution
This package supplies an enforceable envelope contract, deterministic validator, security-review role, bounded adoption workflow, and regression tests. It does not rely on model judgment for authorization.

## Goal
No message from a workflow child reaches an unrelated session without explicit human approval and complete provenance; relayed messages never gain human authority; replies return only to the original principal/session.

## Metrics
- blocked_cross_workflow_messages
- approved_cross_workflow_messages
- provenance_missing_count
- reply_route_mismatch_count
- relayed_human_authority_attempts
- false_positive_rate on declared workflow peers

## Trigger
Before ListAgents/SendMessage-equivalent delivery, and again when a reply is correlated.

## Inputs
Message envelope JSON, workflow/session registry, approval state.

## Outputs
allow/deny decision, reason codes, auditable normalized envelope.

## Verification
Verified only when regression fixtures prove unrelated-child messages are denied, declared peers are allowed, relayed human authority is denied, and mismatched replies are rejected without changing repository state.
