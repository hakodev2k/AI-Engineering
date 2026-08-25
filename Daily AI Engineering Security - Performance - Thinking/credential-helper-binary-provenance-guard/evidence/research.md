# Research

## Topic
Credential-helper executable provenance in AI coding runtimes

## Category
Security

## Problem
An agent or IDE runtime can resolve a security-sensitive credential helper from an attacker-influenceable or runtime-modified search path, or use a bundled toolchain whose helper discovery differs from the trusted terminal. The result can be credential-boundary code execution, confusing authentication failures, or unsafe troubleshooting.

## Why it matters now
Agent products now routinely bridge model-controlled workflows to local Git, OAuth, keychain, and credential helpers. Fresh 2026 reports show that these bridges have materially different executable-resolution and sandbox environments from the user's shell.

## Affected users
Developers using AI coding CLIs/desktop apps, managed macOS fleets, platform teams shipping agent runtimes, and security teams governing local credential access.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #88024, opened 2026-08-19, reports macOS Keychain access invoking bare `security` through `$PATH` rather than `/usr/bin/security`. The report includes a reproducible fake `security` earlier in PATH that is executed instead, and shows forcing `/usr/bin/security` restores correct behavior. https://github.com/anthropics/claude-code/issues/88024
2. OpenAI Codex issue #30811, opened 2026-07-01, reports Codex Desktop using a bundled Git whose helper discovery differs from system Git: `git-credential-osxkeychain` works in the normal terminal but cannot be found by the bundled runtime. This independently demonstrates that agent-packaged runtimes can alter credential-helper resolution semantics. https://github.com/openai/codex/issues/30811
3. Anthropic Claude Code issue #87008, opened 2026-08-15, reports sandboxed macOS commands being unable to reach Keychain while credential-using tools blame the credential rather than the sandbox. This shows credential-helper behavior depends on the agent execution environment and can be misdiagnosed when provenance/environment are not explicit. https://github.com/anthropics/claude-code/issues/87008
4. CWE-426 describes the untrusted search path weakness: software that searches for critical resources in an uncontrolled path can execute an attacker-supplied resource. https://cwe.mitre.org/data/definitions/426.html

### Interpretation
The current incidents span different products and failure modes, but share one boundary problem: the runtime does not provide a deterministic, auditable binding between a credential operation and the exact helper executable/environment that will service it.

## Existing approaches
- OS keychain ACLs and code-signing protections.
- Sandboxing and workspace permission policy.
- Shell PATH conventions and `which`/`command -v` troubleshooting.
- Bundled runtimes for reproducibility.
- Hard-coded helper paths in selected integrations.

## Remaining limitations
- OS ACLs do not prevent a process from launching a shadow helper before the intended keychain tool.
- Sandboxes can change helper accessibility and resolution while returning generic auth failures.
- Bundled runtimes can intentionally override system tools but fail to carry associated credential helpers.
- Manual `which` checks are late, non-enforced, and may inspect a different environment from the actual agent process.
- Hash pinning alone is operationally fragile without an update process.

## Root-cause analysis
1. Bare executable names are used at a security-sensitive boundary.
2. PATH and helper-search variables are inherited from mutable launch environments.
3. Agent desktop/IDE runtimes may inject bundled toolchains ahead of system locations.
4. Error reporting conflates credential failure with helper provenance/sandbox failure.
5. Provenance is checked after failure, not before credential use.

## Improvement opportunity
Introduce a pre-credential deterministic attestation step: policy-controlled absolute path, realpath check, executability check, optional digest pin, and explicit PATH-shadow detection. Run it in the same environment as the agent operation but never execute or read from the helper.

## Proposed solution
This package supplies that policy, checker, bounded remediation workflow, and independent verification contract.

## Goal
Ensure every security-sensitive helper is bound to a reviewed executable identity before credential-bearing operations.

## Metrics
Shadow-resolution mismatches, realpath/hash mismatches, missing helpers, blocked credential operations, provenance-attributed auth failures, and time-to-remediation.

## Trigger
Agent startup, authentication/login, Git remote operation, keychain access, or any tool action that will invoke a local credential helper.

## Inputs
Trusted helper policy and the actual runtime environment.

## Outputs
Machine-readable provenance report and blocking exit status; no credential contents.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/88024
- https://github.com/openai/codex/issues/30811
- https://github.com/anthropics/claude-code/issues/87008
- https://cwe.mitre.org/data/definitions/426.html
