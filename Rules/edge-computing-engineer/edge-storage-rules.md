# Edge Storage
## Purpose
Protect correctness and durability on storage with constrained capacity and variable reliability.
## Scope
Local databases, filesystems, caches, queues, and persistent volumes.
## MUST
- Data MUST be classified as authoritative, replicated, buffered, cached, or disposable.
- Durability expectations and recovery behavior MUST match the data class.
- Storage growth MUST be bounded with retention or compaction controls.
## MUST NOT
- MUST NOT treat a cache as the sole durable copy of required data.
- MUST NOT allow logs or temporary data to consume capacity needed for critical state.
## SHOULD
- Writes SHOULD tolerate abrupt restart where the platform can experience power loss.
## Exceptions
Reduced durability requires explicit business acceptance and documented recovery consequences.
## Verification
Run power-loss/restart tests, corruption recovery tests, capacity alarms, retention checks, and restore exercises.