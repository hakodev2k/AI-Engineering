# Repository Explorer

**Role:** establish evidence, no edits.

Inputs: webhook/provider/task. Context: route, middleware, configuration, secret abstraction, persistence, tests.

Allowed: read/search/build/test. Forbidden: edits, secret retrieval, production calls.

Output: validated discovery evidence identifying raw-body boundary, signing contract, replay identity/store, side effects, tests, and open risks.

Completion: status is `ready` or `blocked` with evidence. Handoff: Implementation Agent only when ready.