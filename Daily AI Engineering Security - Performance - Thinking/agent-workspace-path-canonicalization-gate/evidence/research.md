# Research — Agent Workspace Path Canonicalization Gate

**Topic:** inconsistent workspace-boundary enforcement across agent file-access pipelines  
**Category:** Security  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Coding-agent permission systems can authorize a path before canonical resolution, apply different checks to attachments versus normal file tools, or allow automatic-edit modes to reach outside the intended workspace. The result is a security boundary that looks present in UI/configuration but is not uniformly enforced.

## Why it matters now
Recent 2026 disclosures show the same root failure across independent products: workspace-boundary logic is fragmented across file-access paths and can fail open.

## Affected users
Developers using coding agents with filesystem write/read access, teams enabling auto-edit modes, extension authors, and platform builders implementing sandboxed agent workspaces.

## Current public evidence
### Observed evidence
1. **Microsoft VS Code / Copilot Chat GHSA-3hjg-cwxj-qfc6**, published August 11, 2026. VS Code versions before 1.132.1 could allow the Claude agent integration in “Edit automatically” mode to edit files outside the workspace, contrary to the intended permission boundary.  
   https://github.com/microsoft/vscode/security/advisories/GHSA-3hjg-cwxj-qfc6
2. **Cursor CVE-2026-50549 / GHSA-3v8f-48vw-3mjx**, published June 5, 2026. Cursor’s sandbox path logic could write through a symlink outside the workspace when canonicalization failed; the vulnerable code fell back to the original path instead of denying the operation. Cursor 3.0 changed this to fail closed.  
   https://github.com/cursor/cursor/security/advisories/GHSA-3v8f-48vw-3mjx
3. **Claude Code issue #61148**, opened May 21, 2026. A report showed that `@../` attachment syntax could access a denied file outside the workspace even though direct `Read`, absolute-path reads, and normal workspace attachment syntax were blocked, indicating a separate preprocessing path that did not share the same authorization layer.  
   https://github.com/anthropics/claude-code/issues/61148

### Interpretation
The repeated weakness is an authorization architecture problem, not a single-product path bug. If authorization occurs before canonicalization, or different syntaxes enter different permission pipelines, workspace boundaries become bypassable. UI permission modes can also mask the problem by implying a narrower grant than the runtime enforces.

## Existing approaches
- Workspace-root allowlists.
- Sandbox filesystem restrictions.
- Path canonicalization before write.
- Per-tool allow/deny rules.
- Human approval for outside-workspace or sensitive actions.
- Product patches that block on canonicalization failure.

## Remaining limitations
- Multiple access paths may normalize differently (`Read`, `Write`, attachment, patch, terminal redirect, symlink).
- Canonicalization can fail on missing targets, unreadable parents, race conditions, or symlink chains.
- A fail-open fallback reintroduces arbitrary path risk.
- Auto-edit modes can bypass interactive approvals and therefore require stronger deterministic boundaries, not weaker ones.
- Tests often cover lexical `../` traversal but not resolved symlink targets or nonexistent final components.

## Root-cause analysis
1. Authorization is duplicated across tools instead of centralized.
2. Lexical path checks are used where resolved-path checks are required.
3. Canonicalization failure is treated as an operational inconvenience rather than a security decision.
4. Attachment/preprocessor paths bypass the normal tool authorization hook.
5. Permission mode and workspace scope are conflated.

## Improvement opportunity
Provide a reusable, deterministic gate that performs canonicalization-before-authorization, fails closed when a target cannot be proven safe, resolves existing parent components for new files, rejects symlink escapes, and returns machine-readable evidence for every decision. Integrate it before all file-access mechanisms.

## Relevant sources
- Microsoft VS Code advisory: https://github.com/microsoft/vscode/security/advisories/GHSA-3hjg-cwxj-qfc6
- Cursor advisory / CVE-2026-50549: https://github.com/cursor/cursor/security/advisories/GHSA-3v8f-48vw-3mjx
- Claude Code issue #61148: https://github.com/anthropics/claude-code/issues/61148
