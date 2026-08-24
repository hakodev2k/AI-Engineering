# Research

## Topic
Stale CODEOWNERS coverage on security-sensitive AI/agent repository paths

## Category
Security

## Problem
Repository refactors can leave specialist CODEOWNERS patterns pointing at paths that no longer exist. Broad fallback rules keep ordinary review working, so the loss of security-specific ownership can remain silent.

## Why it matters now
AI-agent and MCP repositories are undergoing rapid monorepo, protocol and memory-system refactors. Those changes move authentication, authorization, memory and agent-control code across package boundaries, exactly where stale ownership rules can remove intended specialist review.

## Affected users
Maintainers of AI/agent SDKs and platforms, security teams, auth/memory subsystem owners, reviewers, and organizations using code-owner review as a merge control.

## Current public evidence

### Observed evidence
1. `modelcontextprotocol/typescript-sdk` issue #2604, opened 2026-08-02 and updated 2026-08-18, reports that all five auth-specific CODEOWNERS paths on `main` matched zero files after the repository became a monorepo. The catch-all still matched, so review requests appeared normal, but `@modelcontextprotocol/typescript-sdk-auth` was not auto-requested. The issue also notes the default-branch ruleset required code-owner review. https://github.com/modelcontextprotocol/typescript-sdk/issues/2604
2. `letta-ai/letta-code` issue #3585, opened 2026-07-31, reports stale camelCase CODEOWNERS entries for memory implementation files after the actual files moved to hyphenated names, preventing the intended `@letta-ai/system-prompt-owners` review from being automatically requested. https://github.com/letta-ai/letta-code/issues/3585
3. GitHub's CODEOWNERS documentation describes automatic review requests based on the effective matching rule and branch-local CODEOWNERS file; therefore coverage depends on patterns continuing to match the live tree. https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners

## Existing approaches
- CODEOWNERS rules and branch/ruleset requirements.
- Catch-all ownership.
- Manual reviewer assignment.
- Updating ownership paths as part of refactor review.

## Remaining limitations
Syntactic validation does not prove semantic coverage. Catch-all ownership masks stale specialist rules. Refactors can rename or relocate files without touching CODEOWNERS. Review requirements ensure the matched owner reviews; they cannot enforce an owner that no longer matches.

## Root-cause analysis
1. Security ownership is encoded as repository path strings that drift during refactors.
2. Specialized rules are not tested against the current tree.
3. Broad fallback ownership creates a false signal that CODEOWNERS is functioning as intended.
4. Critical subsystems lack an explicit machine-readable mapping from live path to required specialist owner.
5. Ownership correctness is checked after a missed review rather than as a deterministic pre-merge invariant.

## Improvement opportunity
Treat security-owner coverage as a testable authorization/review boundary. Maintain a compact manifest of critical paths and required owner handles, evaluate the effective CODEOWNERS rule for each path, and fail closed when the path does not exist, has no matching rule, or lacks a required specialist owner.

## Interpretation
This is not a replacement for GitHub review enforcement. It is a preflight that verifies the policy inputs still describe the live repository, reducing silent review-boundary drift.

## Proposed solution
A dependency-free CODEOWNERS auditor, manifest format, enforceable rules, independent verifier and bounded refactor verification workflow.

## Relevant sources
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2604
- https://github.com/letta-ai/letta-code/issues/3585
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
