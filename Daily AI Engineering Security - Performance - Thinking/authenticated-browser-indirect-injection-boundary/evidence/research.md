# Research

## Topic
Authenticated Browser Indirect Injection Boundary

## Category
Security

## Problem
Agent-controlled browsers can combine untrusted web content with authenticated user sessions. A malicious page can inject instructions that influence the model and cause reads or writes through credentials/cookies the attacker does not possess directly.

## Why it matters now
Browser and MCP integrations increasingly expose real browser profiles instead of isolated fetchers. In `mcp-chrome` issue #316, an open security report explicitly describes indirect prompt injection against authenticated sessions, including risks to email, messaging, and financial data. Claude Code issue #33583 separately reports that Explore subagents may fetch web content without surfacing the same permission prompt as the main agent, creating a hidden ingestion path. OWASP AISVS 1.0 research guidance in 2026 treats prompt injection as a core input-validation/security-control problem and notes broad disparities across MCP clients.

## Affected users
Developers using browser MCP servers, coding/research agents, platform builders exposing Chrome/Chromium sessions, enterprise users whose agent browser shares SSO or internal-app authentication.

## Current public evidence
### Observed evidence
1. `hangwin/mcp-chrome` #316, opened 2026-03-21 and still open in recent crawl, warns that malicious page content can steer an agent with access to active authenticated browser sessions.
2. `anthropics/claude-code` #33583, opened 2026-03-12, reports Explore subagents fetching web content without user-visible permission prompts and identifies prompt-injection risk.
3. OWASP AISVS prompt-injection research chapter, crawled/published in 2026, documents indirect injection and MCP-specific security disparities; transport authentication alone does not solve content-layer injection.

### Interpretation
The dangerous combination is not browsing alone. It is the collapse of four boundaries: untrusted content, reasoning context, authenticated identity, and consequential action. Generic tool approval is too coarse when the same `click` or `evaluate` capability can be harmless on a public page and dangerous on an authenticated internal application.

### Proposed solution
Bind authorization to origin, authentication state, action consequence, and provenance. Treat instructions derived from page content as data, never authority. Require deterministic gating and human approval for sensitive authenticated writes and any cross-origin action chain influenced by untrusted content.

## Existing approaches
Separate browser profiles; incognito mode; user confirmation prompts; domain allowlists; read-only browser tools; generic prompt-injection warnings; browser sandboxing.

## Remaining limitations
Incognito does not help when the workflow requires authentication. Domain allowlists do not distinguish safe reads from dangerous writes. Tool-level permission may persist across origins. Model-only warnings are non-deterministic. Sandboxing the browser process does not prevent misuse of legitimate authenticated application permissions.

## Root-cause analysis
1. Browser content and user instructions are merged into the same semantic channel.
2. Authorization is attached to tool names rather than target origin and action consequence.
3. Authenticated browser identity is ambient and automatically reused.
4. Provenance of the instruction leading to an action is not carried into the tool-call decision.
5. Hidden DOM/accessibility/off-screen text may influence the model without corresponding user awareness.
6. Audit logs often record actions but not the untrusted evidence that caused them.

## Improvement opportunity
Add an enforcement layer before browser actions: source/target origin normalization, authenticated-state flag, action classification, provenance flag, human-approval evidence, and fail-closed policy. Keep secrets/cookies out of model-visible logs.

## Goal
Prevent untrusted browser content from silently converting ambient authenticated sessions into unauthorized reads/writes while preserving useful browser automation.

## Metrics
Unsafe transition block rate; sensitive-action approval coverage; cross-origin untrusted chain count; policy bypass test pass rate; provenance completeness; false-positive rate.

## Trigger
Any browser/MCP/agent integration using authenticated profiles, cookies, SSO, internal web apps, or browser-controlled write actions.

## Inputs
Source origin, target origin, action class, authentication state, provenance, human-approval state, policy.

## Outputs
ALLOW/BLOCK decision, reason codes, required approval state, audit-safe metadata.

## Relevant sources
- mcp-chrome #316 (2026-03-21): https://github.com/hangwin/mcp-chrome/issues/316
- Claude Code #33583 (2026-03-12): https://github.com/anthropics/claude-code/issues/33583
- OWASP AISVS prompt-injection research: https://github.com/OWASP/AISVS/blob/main/1.0/research/chapters/C02-User-Input-Validation/C02-01-Prompt-Injection-Defense.md
- Chrome DevTools MCP security scan discussion #1053 (2026): https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/1053
