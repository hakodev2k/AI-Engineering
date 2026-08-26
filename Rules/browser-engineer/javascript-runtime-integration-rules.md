# JavaScript Runtime Integration Rules
## Purpose
Keep bindings between the browser engine and JavaScript runtime correct, secure, and resource-safe.
## Scope
Bindings, realms, wrappers, callbacks, promises, exceptions, GC integration, and script execution.
## MUST
- Realm and execution-context boundaries MUST be preserved for every web-exposed operation.
- Native objects referenced by script MUST have explicit lifetime and tracing semantics.
- Exceptions and promise rejection behavior MUST match the web-visible contract.
## MUST NOT
- MUST NOT hold unsafe native references across garbage-collection or asynchronous boundaries.
- MUST NOT execute script from a context that forbids reentrancy without an explicit safe handoff.
## SHOULD
- SHOULD minimize boundary crossings on hot paths when semantics remain unchanged.
## Exceptions
Exceptions require runtime-owner review, lifecycle proof, and targeted stress tests.
## Verification
Use binding tests, GC stress, realm tests, reentrancy tests, sanitizers, fuzzers, and runtime tracing.