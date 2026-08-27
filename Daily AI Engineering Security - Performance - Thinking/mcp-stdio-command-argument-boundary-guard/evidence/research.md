# Research — MCP stdio Command Argument Boundary Guard
**Topic:** executable-only MCP stdio validation permits dangerous arguments  
**Category:** Security  
**Research date:** 2026-08-28 (UTC+7)

## Problem
A platform can appear to restrict MCP stdio server execution while validating only the executable name. If the executable is a shell-capable wrapper or package runner, attacker-controlled arguments can reintroduce arbitrary shell execution.

## Why it matters now
On 2026-08-25 GitHub published reviewed advisory CVE-2026-45018 for Chainlit. When MCP was enabled, its `/mcp` stdio path accepted a user-controlled `fullCommand`; validation checked the executable name against an allowlist but did not safely constrain arguments. The advisory describes `npx -y -c 'ARBITRARY COMMAND'` as an exploitation path and identifies Chainlit 2.12.0 as patched.

A separate 2026 GitHub Copilot CLI advisory, CVE-2026-29783, shows the same broader class of failure at another layer: a shell safety classifier judged commands before execution, but crafted Bash expansion could bypass the intended read-only/approval boundary.

## Affected users
MCP client authors, agent-platform developers, self-hosted Chainlit users with MCP enabled, and teams that approve stdio servers by executable name.

## Current public evidence
### Observed evidence
1. GitHub Advisory Database, CVE-2026-45018 / GHSA-w3fx-mc44-mf6j, published 2026-08-25: Chainlit MCP stdio command injection; affected `>=2.4.0rc0, <=2.11.1`; patched in `2.12.0`.  
   https://github.com/advisories/GHSA-w3fx-mc44-mf6j
2. GitHub Advisory Database, CVE-2026-29783 / GHSA-g8r9-g2v8-jv6f, published 2026-03-06: Copilot CLI shell-expansion patterns could bypass safety assessment and execute commands influenced by prompt injection.  
   https://github.com/advisories/GHSA-g8r9-g2v8-jv6f

### Interpretation
Both incidents demonstrate that “approved executable” or “classified command” is not the same as an authorized operation. The security boundary must cover the complete parsed invocation and must not rely on shell re-parsing.

## Existing approaches
- Executable allowlists.
- Disabling MCP by default.
- Human approval before command execution.
- Sandboxing.
- Command text scanning.

## Remaining limitations
- Executable allowlists ignore argument semantics.
- Shell/package-runner flags can create a second interpreter.
- String scanners are fragile around quoting and expansion.
- Human approval can be misleading if the effective invocation is not normalized and displayed.
- Sandbox containment reduces blast radius but does not establish intent or authorization.

## Root-cause analysis
1. Authorization is performed on a partial representation.
2. Command strings are parsed or re-parsed by a shell after validation.
3. Wrapper executables have broad implicit capabilities.
4. Policy is not bound to a specific server identity and exact argv contract.
5. Approval UIs may omit normalized arguments.

## Improvement opportunity
Use a structured spawn contract: no `fullCommand`; no shell; exact executable; server-bound allowed argv prefix; bounded extra args; explicit regexes for extras; deny known interpreter execution flags and shell metacharacters. Fail closed before process creation.

## Relevant sources
- https://github.com/advisories/GHSA-w3fx-mc44-mf6j
- https://github.com/advisories/GHSA-g8r9-g2v8-jv6f
