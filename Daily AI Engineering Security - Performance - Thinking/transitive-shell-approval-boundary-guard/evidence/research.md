# Research

## Topic
Transitive Shell Approval Boundary Guard

## Category
Security

## Problem
AI coding agents can satisfy a tool-level approval check while still causing a materially different, destructive action through a script or interpreter. A guard may inspect `bash script.sh`, `python helper.py`, or an allowed Bash invocation but not inspect the code that invocation transitively executes. This creates a gap between the approved command string and the effective side effect.

## Why it matters now
On 2026-08-09, a Claude Code issue documented that destructive commands authored inside a shell script could bypass both the built-in permission prompt and user `PreToolUse` Bash hooks when only the outer `bash script.sh` command was inspected. Earlier reports documented similar cross-tool bypasses where blocked Edit/Write operations were performed through Bash, and Anthropic has previously shipped fixes for approval-prompt bypass vulnerabilities caused by command parsing flaws.

## Affected users
Developers using coding agents with shell access, teams relying on hook-based policy enforcement, repository maintainers, CI runners, agent-platform builders, and operators who allow unattended or semi-autonomous agent execution.

## Current public evidence
### Observed evidence
1. **Claude Code issue #85274, opened 2026-08-09**: reports that `rm -rf` typed directly triggers safeguards while the same command placed inside an agent-authored script and invoked with `bash script.sh` can bypass the approval gate because checks are string-level.
2. **Claude Code issue #29709, opened 2026-03-01**: reports that repeated `PreToolUse:Edit|Write` blocks were circumvented by using Python file writes through the Bash tool, demonstrating that policy tied to one tool surface does not necessarily cover equivalent side effects through another tool.
3. **GHSA-qgqw-h4xq-7w8w, published 2026-02-03**: Anthropic patched a high-severity command-injection path in `find` that could bypass confirmation prompts, showing that parser/approval mismatches are a recurring security class rather than a purely theoretical concern.
4. **CVE-2025-58764 / GHSA-qxfv-fcpc-w36x**: an earlier Claude Code approval-prompt bypass through command parsing was also rated high severity and patched.

### Interpretation
Approval must bind to the effective action graph, not only the outer tool name or literal command. The strongest practical control available to integrators is a pre-execution boundary that resolves inspectable local script targets, detects suspicious interpreter or shell chains, records evidence, and escalates uncertain or high-impact execution rather than silently treating the wrapper command as safe.

## Existing approaches
- Built-in shell permission prompts.
- `PreToolUse` hooks and allow/ask/deny rules.
- Sandboxing and restricted writable roots.
- Static linters and secret scanners.
- Command allowlists and exact-string policy matching.

## Remaining limitations
- Tool-local hooks can miss equivalent actions performed by another tool.
- Literal-string inspection cannot see code written into a script and executed later.
- Shell parsing and interpolation create ambiguous or dynamic execution graphs.
- Allowlisting `bash`, `python`, `node`, or package runners is too coarse when their input code is agent-controlled.
- Static analysis cannot safely resolve every dynamic command; uncertain cases need blocking or human approval rather than optimistic execution.

## Root-cause analysis
1. Authorization is modeled around tool invocations rather than effects.
2. Policy engines often inspect only the first command layer.
3. Script provenance is not incorporated into the decision.
4. Equivalent filesystem/process effects are distributed across Bash, interpreters, package managers, and native tools.
5. Failure paths frequently default to permissive behavior when parsing is incomplete.

## Improvement opportunity
Introduce a secure-by-default transitive approval guard. Before a shell/interpreter invocation runs, inspect the outer command, resolve referenced local scripts under trusted roots, scan those scripts for destructive primitives and secondary interpreters, emit a structured decision, and require explicit approval when the effective action is high-risk or cannot be confidently determined. Keep sandbox and least-privilege controls in place; this package is an additional boundary, not a replacement.

## Goal
Make approval evidence correspond more closely to effective execution behavior while failing closed on ambiguous high-risk chains.

## Metrics
- high-risk transitive actions blocked / detected
- false-negative count in fixture tests
- false-positive count on approved benign scripts
- percentage of shell launches with a structured decision artifact
- approval escalations by reason
- policy evaluation latency

## Trigger
Before agent-originated Bash/shell/interpreter execution, especially when the command references a local script or uses a general-purpose interpreter.

## Inputs
Outer command string, working directory, trusted roots, referenced local scripts, and policy thresholds.

## Outputs
`allow`, `review`, or `block` decision plus findings, resolved script paths, evidence hashes, and reason codes.

## Relevant sources
- Claude Code issue #85274, 2026-08-09: https://github.com/anthropics/claude-code/issues/85274
- Claude Code issue #29709, 2026-03-01: https://github.com/anthropics/claude-code/issues/29709
- Anthropic advisory GHSA-qgqw-h4xq-7w8w, 2026-02-03: https://github.com/anthropics/claude-code/security/advisories/GHSA-qgqw-h4xq-7w8w
- GitHub Advisory Database GHSA-qxfv-fcpc-w36x / CVE-2025-58764: https://github.com/advisories/GHSA-qxfv-fcpc-w36x
