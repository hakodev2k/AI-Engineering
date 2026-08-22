# Research Evidence

## Topic
Sandbox Path Rebinding Integrity Gate

## Category
Security

## Problem
Switching an agent between Windows-native and WSL can leave `cwd`, workspace roots, writable roots, sandbox paths, permission profiles, shell metadata, and rollout state bound to different path namespaces. The observed result is broken execution; because these fields define filesystem authority, migration must also be treated as a security-boundary integrity problem and fail closed on inconsistent roots.

## Why it matters now
Two open Codex reports document the inverse migration directions. On 2026-08-15, #38781 reported WSL→Windows state becoming `C:\\mnt\\d\\...` while writable roots remained WSL paths. #36608 documents Windows→WSL chats retaining Windows filesystem sandbox and permission-profile records, malformed working directories, and deserialization failures.

## Affected users
Agent users switching execution environments, Windows/WSL coding-agent platforms, runtime authors persisting filesystem permissions, and teams migrating long-running agent sessions.

## Current public evidence
### Observed evidence
- openai/codex#38781: WSL→Windows migration left inconsistent state across `state_5.sqlite`, `threads.sandbox_policy`, global `thread-writable-roots`, and rollout `turn_context`/`world_state`. Manual repair changed 8 SQLite threads, 7 global-state paths, 95 session records, and 1261 strings before chats resumed.
- openai/codex#36608: Windows→WSL migration retained Windows working directories, shell, filesystem sandbox paths, and permission-profile structures. Moving/continuing a chat did not rebind them; a newly created WSL chat worked correctly.

### Interpretation
The public reports demonstrate boundary-state inconsistency and availability failures. They do not demonstrate a successful privilege escalation. Security relevance follows from the fact that writable roots, sandbox paths, and permission profiles encode filesystem authority; accepting a partially translated policy could cause an enforcement/runtime mismatch. The proposed guard therefore fails closed rather than claiming an observed exploit.

### Proposed solution
Canonicalize source/destination path identities before migration, explicitly map approved project roots, reconstruct sandbox/permission roots for the destination namespace, audit every persisted representation, and commit only when all security-relevant roots converge to an approved canonical target. Keep migration transactional with backup/rollback.

## Existing approaches
Fresh chats initialize correct environment-specific state. Manual path replacement can recover affected chats. Moving a chat/project or continuing in a new chat preserves history.

## Remaining limitations
Fresh initialization does not migrate old state; partial string replacement can miss security-relevant representations; moving/continuing may preserve stale bindings; state is distributed across SQLite, global JSON, rollout records, and permission profiles.

## Root-cause analysis
1. Environment-specific path identity is persisted in several stores.
2. Migration is not atomic across all representations.
3. Path conversion can be syntactically valid yet semantically wrong (`C:\\mnt\\d`).
4. Sandbox/writable-root policy is coupled to path namespace and cannot safely be copied verbatim.
5. Post-migration equivalence/inclusion checks are insufficient.

## Improvement opportunity
Use deterministic source→destination mapping, canonical approved roots, deny ambiguous/unmapped paths, compare every policy root against the destination allow-set, stage changes, verify, then commit atomically.

## Relevant sources
- https://github.com/openai/codex/issues/38781
- https://github.com/openai/codex/issues/36608
