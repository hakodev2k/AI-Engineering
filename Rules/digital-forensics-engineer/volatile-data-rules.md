# Volatile Data Rules

## Purpose
Preserve high-value evidence that can disappear through shutdown, timeout, process exit, or normal system activity.

## Scope
Covers memory, processes, network state, sessions, temporary credentials, runtime configuration, and ephemeral workloads.

## MUST
- Volatility and expected evidentiary value MUST determine collection priority.
- Live collection MUST document commands/tools executed and their expected footprint.
- Memory acquisition MUST record system state, acquisition mechanism, timing, errors, and integrity data.
- Analysts MUST distinguish observations made live from artifacts recovered later.
- Collection that may materially disrupt production MUST be risk-assessed and authorized.

## MUST NOT
- MUST NOT reboot or power off a relevant system before assessing volatile evidence loss unless safety or authorization requires it.
- MUST NOT claim live-state completeness when collection tooling can alter or omit state.
- MUST NOT execute untrusted binaries on an evidence source without justification.

## SHOULD
- Capture synchronized time context before other live commands.
- Collect network, process, login, and encryption context when relevant.

## Exceptions
Immediate containment or safety actions may supersede preservation; document the decision, authority, evidence lost, and compensating sources.

## Verification
Review command transcripts, tool hashes, acquisition timestamps, memory-image validation, system logs, and corroboration across volatile sources.