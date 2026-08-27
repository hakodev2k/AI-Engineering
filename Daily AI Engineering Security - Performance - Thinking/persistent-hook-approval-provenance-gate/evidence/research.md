# Research — Persistent Hook Approval Provenance Gate
**Topic:** Persistent hook trust can be satisfied or reflected without a trustworthy human-approval boundary.  
**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Persistent or lifecycle hooks execute host commands outside ordinary model tool approval. Current integration paths can accidentally let agent-generated input, server tools, stale working directories, or changed hook hashes satisfy trust.

## Why it matters now
Recent Codex and VS Code reports show that hook trust is becoming a real cross-product integration boundary rather than a theoretical prompt concern. Persistent global hooks can affect later sessions and projects.

## Affected users
Agent-host maintainers, Codex/VS Code users, platform builders embedding hook-capable agents, and teams relying on workspace trust or human review.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37890 reports Codex CLI 0.146.0 allowing an agent in danger-full-access mode to author a persistent global hook, launch a nested TUI through a PTY, and synthesize the interactive “Trust all and continue” approval. Trust persisted. https://github.com/openai/codex/issues/37890
2. Microsoft VS Code issue #331733 documents an in-progress Codex agent-host fix and an independent security review finding multiple trust gaps: SessionEnd can execute outside the expected Workspace Trust gate; server-tool session creation can operate on arbitrary workspaces; restored session cwd can differ from the trusted cwd; and reflecting current hashes can bypass re-review for modified hooks. https://github.com/microsoft/vscode/issues/331733
3. OpenAI Codex issue #38371 requests a safe thread-scoped host hook-registration contract because the broad `bypass_hook_trust` workaround trusts too much; the request calls for exact hook identities/provenance and scoped trust across start/resume/fork. https://github.com/openai/codex/issues/38371

### Interpretation
The common failure is provenance loss at the trust-decision boundary. A prompt or UI saying “approve?” is not a human boundary if agent-controlled input can answer it, and workspace trust is not sufficient when execution can occur through lifecycle or server-tool paths that never validate the authoritative cwd.

## Existing approaches
- Per-hook content hashes and re-review after changes.
- Workspace Trust and sandbox/approval systems.
- Thread-scoped hook state rather than global bypass.
- Managed hooks whose provenance is controlled centrally.

## Remaining limitations
- Input origin is often not authenticated as human vs model/PTY automation.
- Trust checks may occur in renderer/UI paths instead of the actual lifecycle execution boundary.
- Persisted/resumed cwd can drift from the folder that was originally approved.
- Reflecting a current hash without checking prior trust state converts “what exists” into “what is trusted.”

## Root-cause analysis
1. Approval semantics are represented as UI events rather than security principals.
2. Hook identity/hash, cwd trust, lifecycle event, and approval origin are checked by different layers.
3. Trust is sometimes inferred from current state instead of bound to a reviewed immutable hash.
4. Alternative execution paths bypass the workbench trust gate.

## Improvement opportunity
Create a deterministic pre-execution gate that binds the exact hook hash to a trusted approval origin and authoritative cwd for every lifecycle event. Agent/PTY input can never establish persistent trust. Modified hooks must be re-approved. Server-initiated paths use the same gate.

## Relevant sources
- https://github.com/openai/codex/issues/37890
- https://github.com/microsoft/vscode/issues/331733
- https://github.com/openai/codex/issues/38371
