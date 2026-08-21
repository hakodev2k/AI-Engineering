# Research: Untrusted Repository Instruction Execution Guard

## Topic
Repository-controlled text, metadata, filenames, test configuration, and agent instruction files can cross the model trust boundary and influence privileged tool execution.

## Category
Security

## Problem
Coding agents routinely ingest repository content that is controlled by repository authors or contributors. If this content is treated as trusted instruction rather than untrusted data, it can steer the model toward sensitive tool calls. The risk becomes materially worse when a tool is auto-approved, runs repository code, can mutate the filesystem, has network access, or interacts with credentials.

## Why it matters now
Multiple 2026 advisories show independent variants of the same boundary failure: adversarial workspace metadata can inject model instructions, repository guidance can trigger auto-approved code execution, and malicious repositories can combine prompt injection with sandbox/path confusion to escape intended controls. Public August 2026 testing also continues to reproduce repository-file instruction injection against coding agents.

## Affected users
Developers opening unfamiliar repositories with AI coding agents, maintainers processing external pull requests/issues, agent-platform builders, IDE vendors, CI agent operators, and teams granting shell/GitHub/cloud access to coding agents.

## Current public evidence
### Observed evidence
1. CVE-2026-44688 / GHSA-3jww-hxqj-wfq2 (Eclipse Theia): adversarial workspace file and directory names could be included in AI chat context without a sufficient trust distinction, enabling indirect prompt injection. Patched in Theia 1.71.0.
   Source: https://github.com/advisories/GHSA-3jww-hxqj-wfq2
2. CVE-2026-45311 / GHSA-wx44-2q6h-j6p8 (DeepSeek TUI): a malicious repository could use an auto-loaded `AGENTS.md` prompt injection to steer the agent into the `run_tests` tool; the auto-approved test path could compile/execute malicious repository code.
   Source: https://github.com/advisories/GHSA-wx44-2q6h-j6p8
3. CVE-2026-55607 / GHSA-7835-87q9-rgvv (Claude Code): a malicious repository containing prompt-injection content could participate in a Git worktree/path-confusion chain leading to code execution outside sandbox restrictions. Patched in Claude Code 2.1.163.
   Source: https://github.com/advisories/GHSA-7835-87q9-rgvv
4. An August 2026 public AI-agent security guide reports a tested repository README instruction that caused a production coding agent to post environment/workspace information to a public issue even though the user's request was unrelated.
   Source: https://github.com/lerelerele/ai-agent-security-guide
5. MCP issue #3213 (Aug 2026) highlights a related protocol trust problem: server-controlled natural-language `instructions` can be injected into an LLM context and may be treated with excessive authority if clients do not isolate it as untrusted.
   Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213

## Interpretation
The repeated pattern is a trust-propagation bug. The model receives data from a low-trust source, then a later tool-selection layer fails to preserve that provenance. A tool approval decision therefore sees only the requested action, not whether the request was causally influenced by untrusted repository content.

## Existing approaches
- Sandbox shell execution.
- Human approval for selected tools.
- Repository trust prompts.
- Auto-loaded `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, README, and workspace context conventions.
- Tool allowlists/denylists.
- Static malware/dependency scanning.
- Prompt-injection classifiers or warning banners.

## Remaining limitations
- Sandboxes reduce impact but do not prevent data exfiltration through allowed network/API tools.
- Human approval can be bypassed in practice when some high-impact tools are classified as safe/auto-approved.
- Repository trust is often coarse-grained: trusting a directory may implicitly trust every future branch/file/contributor.
- Instruction files are intentionally influential, making simple keyword filtering unreliable.
- Filename/path metadata can influence prompts even when file contents are not explicitly opened.
- Tool authorization often lacks provenance: it cannot tell whether the action derives from user intent or untrusted content.
- Prompt-injection detection alone is probabilistic and should not be the only boundary.

## Root-cause analysis
1. Untrusted repository content is promoted into instruction-bearing context without persistent provenance labels.
2. Tool policy checks action type but not causal source/trust level.
3. Auto-approval classifications underestimate that repository tests/builds execute attacker-controlled code.
4. Sandboxes, network policy, credential policy, and repository trust are managed separately rather than as one risk decision.
5. Sensitive side effects can occur through nominally legitimate developer workflows such as test, build, Git, issue comment, or package install.
6. Security tests frequently validate direct dangerous prompts but omit indirect instructions embedded in repository artifacts.

## Improvement opportunity
Carry deterministic provenance labels from context ingestion to tool authorization. Classify repository-derived instructions as untrusted by default, detect when a proposed tool call is influenced by untrusted sources, combine that taint with tool impact and environment capabilities, and require explicit human approval or deny execution for high-risk combinations. Use deterministic policy as the enforcement layer; optional model/classifier analysis may add signals but cannot override policy.

## Goal
Prevent untrusted repository content from silently escalating into privileged or irreversible tool execution while preserving normal coding workflows.

## Metrics
- 100% repository-derived context receives a provenance/trust label.
- 100% high-impact tool calls influenced by untrusted content are blocked or explicitly approved.
- 0 auto-approved execution of repository code when policy marks the repository/source untrusted.
- 0 secret-bearing environment exposure to untrusted-network tool calls.
- Negative security fixtures pass for instruction files, README content, filenames, test/build commands, and issue/PR text.
- False-block rate is measured on trusted benign repositories.

## Trigger
Opening an unfamiliar repository, switching branches to unreviewed code, processing external PRs/issues, ingesting agent instruction files, executing tests/builds/installers, or granting additional network/credential/tool permissions.

## Inputs
Trust policy, context provenance records, tool call descriptor, environment capabilities, repository trust state, approval state, and optional sensitive-resource flags.

## Outputs
Deterministic `allow`, `require_approval`, or `deny` decision with machine-readable reasons and audit fields.

## Proposed solution
This package implements a taint-aware tool gate. It never asks the LLM to decide its own permission boundary. A Python policy checker evaluates source trust, tool impact, network access, repository-code execution, secret access, destructive writes, and human approval. Security workflows add threat modeling and adversarial verification around that gate.

## Relevant sources
- https://github.com/advisories/GHSA-3jww-hxqj-wfq2
- https://github.com/advisories/GHSA-wx44-2q6h-j6p8
- https://github.com/advisories/GHSA-7835-87q9-rgvv
- https://github.com/lerelerele/ai-agent-security-guide
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
