# Research — Agent Execution-Sensitive Path Write Gate

**Topic:** Prevent AI coding agents from silently modifying execution-sensitive configuration paths that redefine their own trust boundary.  
**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Problem
AI coding agents commonly receive untrusted repository, web, issue, dependency, and tool-output content while also holding file-write and execution capabilities. If the agent can write execution-sensitive files such as IDE task files, hooks, shell startup files, MCP configuration, CI workflow definitions, or agent policy files without a separate authorization boundary, indirect prompt injection can become code execution or durable privilege escalation.

## Why it matters now
This remains current in 2026 because multiple disclosures show the same architectural failure: a model influenced by untrusted text can modify a file that changes what code will later execute or what permissions the agent has. The issue persists even when human approval exists for shell commands, because the write itself may be treated as an ordinary file edit.

## Affected users
Developers using agentic IDEs or coding agents, platform builders, enterprise developer-experience teams, and maintainers of autonomous code-review or remediation systems.

## Current public evidence

### Observed evidence
1. AWS bulletin for **CVE-2026-10591**, published June 2, 2026, states that insufficient file-write access controls in Kiro before version 0.11 could let crafted instructions cause writes to execution-sensitive paths such as `.vscode/tasks.json`, enabling arbitrary command execution on folder open.  
   https://aws.amazon.com/security/security-bulletins/2026-037-aws/
2. Intezer and Kodem published a detailed July 20, 2026 analysis showing that hidden instructions in fetched web content could make Kiro rewrite `~/.kiro/settings/mcp.json`; because Kiro reloaded that file, attacker-controlled MCP startup commands could execute with the user's privileges without a meaningful approval gate.  
   https://research.intezer.com/blog/2026/07/remote-code-execution-kiro/
3. AWS had already published **CVE-2026-4295** on March 17, 2026 for arbitrary code execution from crafted project files caused by improper trust-boundary enforcement in Kiro, providing an independent signal that execution-triggering project state is a recurring agent security surface.  
   https://aws.amazon.com/security/security-bulletins/2026-009-AWS/

### Interpretation
The core failure is not only prompt injection. It is an authorization-model defect: file-write permissions are too coarse, and the platform fails to distinguish ordinary source edits from edits that alter execution, tool registration, credentials, policy, or future approval behavior.

## Existing approaches
- Upgrade to vendor-patched versions.
- Human approval for shell/tool execution.
- Workspace trust and sandboxing.
- File allowlists/denylists.
- Repository branch protection and code review.
- Prompt-injection detection.

## Remaining limitations
- Approval on execution is too late if a prior file write changes future execution behavior.
- Static denylists often miss tool-specific or repository-specific sensitive paths.
- Path checks may fail across symlinks, path traversal, case normalization, or user-home expansion.
- Prompt-injection classifiers are probabilistic and cannot serve as the primary authorization boundary.
- Existing IDE protections are product-specific, while teams operate multiple coding agents and custom harnesses.

## Root-cause analysis
1. File-write tools expose broad path capabilities rather than consequence-based capabilities.
2. Agent runtimes often authorize a write based on path existence or workspace location, not downstream execution semantics.
3. Sensitive-path inventories are incomplete and do not include dynamically configured MCP, CI, hooks, startup, or policy files.
4. Canonicalization and symlink resolution are inconsistently enforced before policy evaluation.
5. Implementing agents may also be the only verifier of their own changes.

## Improvement opportunity
Create a reusable deterministic write gate that canonicalizes target paths, classifies execution-sensitive patterns, blocks writes outside approved roots, detects symlink escape, requires explicit human approval for sensitive writes, and records a machine-readable decision. Pair it with an independently maintained sensitive-path policy and regression fixtures.

## Goal
Prevent model-influenced content from silently changing execution-sensitive state while preserving normal source-code editing.

## Metrics
- Sensitive-write block rate.
- Sensitive-write approval coverage.
- Symlink/path-escape detection rate.
- False-positive rate on ordinary source edits.
- Regression attack-fixture pass rate.

## Trigger
Any file-write request from an AI agent or automated coding workflow.

## Inputs
Requested path, workspace root, operation type, human-approval state, policy, and filesystem metadata.

## Outputs
`allow`, `require_approval`, or `block`, with reason codes and canonical path.

## Relevant sources
- AWS CVE-2026-10591: https://aws.amazon.com/security/security-bulletins/2026-037-aws/
- Intezer/Kodem Kiro research: https://research.intezer.com/blog/2026/07/remote-code-execution-kiro/
- AWS CVE-2026-4295: https://aws.amazon.com/security/security-bulletins/2026-009-AWS/
