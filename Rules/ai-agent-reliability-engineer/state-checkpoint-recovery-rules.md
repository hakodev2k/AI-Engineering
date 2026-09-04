# State Checkpoint and Recovery Rules

## Purpose
Ensure agent workflows can recover from crashes, restarts, and partial execution without duplicating work or corrupting state.

## Scope
Applies to long-running agent workflows, multi-step tool execution, durable orchestration, and any process that may resume after interruption.

## MUST
- Workflows MUST checkpoint after irreversible, externally committed, or materially expensive milestones.
- Checkpoints MUST record workflow version, completed step identity, relevant input references, external operation identifiers, and enough state to determine the next safe action.
- Checkpoint writes MUST be atomic or include a consistency marker that allows incomplete writes to be detected.
- Recovery MUST validate that authorization, configuration, workflow version, and required dependencies remain compatible before resuming.
- Missing, corrupted, or ambiguous checkpoints MUST produce a safe failure or explicit reconciliation path.
- Recovery logic MUST account for side effects that may have committed externally even if local checkpoint persistence failed.

## MUST NOT
- Agents MUST NOT resume from an ambiguous execution position by guessing which steps completed.
- Checkpoints MUST NOT persist credentials, tokens, or unnecessary sensitive payloads.
- Recovery MUST NOT assume external systems rolled back because the local process terminated.

## SHOULD
- Checkpoints SHOULD be deterministic, compact, versioned, and independently inspectable.
- Retention SHOULD match operational recovery needs and applicable data-retention policy.

## Exceptions
Exceptions require documented recovery semantics, evidence that lost progress or duplication is acceptable, risk assessment, and owner approval for production workflows with side effects.

## Verification
Inject crashes before and after each checkpoint boundary, corrupt checkpoint data, interrupt persistence after external commits, and verify deterministic safe recovery or reconciliation.