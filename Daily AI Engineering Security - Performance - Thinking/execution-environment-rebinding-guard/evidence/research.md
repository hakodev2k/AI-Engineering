# Research Evidence

## Topic
Execution Environment Rebinding Guard

## Category
Security

## Problem
Long-running agent threads persist execution-environment state across multiple stores: working directory, workspace roots, writable roots, sandbox policy, shell, permission profile, project binding, host-skill paths, and rollout world-state. Switching between Windows-native and WSL can migrate only part of that state, producing malformed paths, stale permission roots, broken project association, or deserialization failures. This is both a reliability and trust-boundary problem because the runtime may reason from one workspace identity while permission/sandbox state still references another.

## Why it matters now
Recent Codex reports show the failure in both migration directions. One report documents Windows-native -> WSL retaining Windows cwd, PowerShell, workspace roots, sandbox and permission-profile state; another documents WSL -> Windows-native rewriting `/mnt/d/...` into malformed `C:\mnt\d\...` while other writable-root and rollout records remain WSL-formatted. A related WSL switching report shows preserved backend history becoming hidden at the UI/project-classification layer even when `thread/list` still returns the threads.

## Affected users
Developers switching local execution runtimes, Windows/WSL users, agent-platform teams persisting thread state, sandbox/permission implementers, and systems that rebind long-running agents to new workspaces or hosts.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #36608: Windows-native -> WSL leaves environment-specific Windows metadata in existing chats. Reported failures include malformed working directories and permission-profile deserialization errors. The reporter found valid conversation JSON but retained Windows cwd, shell, workspace roots, sandbox, and permission data. https://github.com/openai/codex/issues/36608
2. OpenAI Codex issue #38781: WSL -> Windows-native partially migrates state, creating `C:\mnt\d\...`, preserving WSL writable roots and rollout state, and losing project association. Manual recovery required coordinated changes across SQLite, global state, and rollout JSONL. https://github.com/openai/codex/issues/38781
3. OpenAI Codex issue #32902: switching to WSL preserved backend thread data while Desktop hid history; the issue explicitly points to Windows/WSL cwd normalization and runtime/path classification. https://github.com/openai/codex/issues/32902

### Interpretation
The common failure is not merely path-string conversion. The durable identity of an agent execution environment is distributed across multiple persisted representations. Updating only cwd or project root leaves trust-sensitive derivatives such as writable roots, sandbox paths, permission profiles, shell metadata, and host-skill locations inconsistent. A successful migration therefore needs atomic validation across the entire binding set.

## Existing approaches
- New chats created after the environment switch use the current runtime correctly.
- Manual repair can rewrite path-bearing state across SQLite/global state/rollouts.
- Moving a chat or using Continue in new chat preserves conversation history.
- Some implementations normalize one visible path or regenerate a subset of current state.

## Remaining limitations
- Rebinding is not guaranteed to be atomic across stores.
- A path may be syntactically valid but mapped to the wrong host/runtime.
- Permission and writable-root state can remain stale after cwd changes.
- Conversation continuation can copy broken environment metadata forward.
- Manual repair is dangerous without backup, process quiescence, full inventory, and post-migration verification.

## Root-cause analysis
1. Environment identity is implicit rather than represented as a versioned binding object.
2. Path conversion and permission regeneration are coupled inconsistently.
3. Multiple stores are updated independently without a cross-store commit/rollback contract.
4. Consumers accept stale state instead of failing closed on mixed runtime provenance.
5. Project association and sandbox state depend on derived path equality rather than a canonical workspace identity.

## Improvement opportunity
Introduce a reusable rebinding gate that inventories every environment-sensitive field, computes a canonical target mapping, validates destination paths and permission scope, generates a migration plan, blocks mixed-provenance state, and requires backup + verification before commit. Deterministic tooling can inspect exported structured state without editing it.

## Relevant sources
- https://github.com/openai/codex/issues/36608
- https://github.com/openai/codex/issues/38781
- https://github.com/openai/codex/issues/32902

## Goal
Prevent an agent thread from executing after a runtime/workspace switch until all environment-sensitive state is consistently rebound or explicitly rejected.

## Metrics
- mixed-runtime references detected per thread
- unmapped paths per thread
- stale writable/sandbox roots after migration
- project-binding mismatches
- preflight rejection rate
- successful post-migration resume rate
- rollback success rate
- security regression count: target 0

## Trigger
Execution runtime, host, workspace root, shell family, sandbox implementation, or filesystem namespace changes for a persisted thread.

## Inputs
Exported thread state, global state, rollout/world-state records, source/target environment descriptors, path mapping table, expected workspace root, permission policy.

## Outputs
Inventory report, deterministic findings, safe/unsafe decision, migration plan, verification report.