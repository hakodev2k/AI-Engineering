# Browser Integration Rules

## Purpose
Keep browser-hosted WebAssembly secure, responsive, compatible, and correctly integrated with web platform boundaries.

## Scope
Applies to JavaScript/WebAssembly interop, workers, streaming instantiation, browser APIs, CSP, and asset delivery.

## MUST
- Browser capability access MUST remain subject to the web platform's origin and permission model.
- Main-thread WebAssembly work MUST be bounded so it does not create unacceptable UI blocking.
- JavaScript/Wasm boundary types and ownership MUST be explicit and tested.
- Browser support requirements for threads, SIMD, memory features, or proposals MUST be detected or documented.
- Wasm assets MUST be delivered with correct integrity, caching, and content-type behavior appropriate to the application.

## MUST NOT
- WebAssembly MUST NOT be treated as a bypass for browser security controls.
- Sensitive values MUST NOT be embedded in client-side wasm under the assumption that compilation hides them.
- Cross-origin isolation requirements for shared-memory features MUST NOT be enabled without assessing application-wide security and integration impact.

## SHOULD
- Move sustained compute off the main thread where practical.
- Minimize chatty JS/Wasm crossings on hot paths.
- Test fallback behavior for unsupported features.

## Exceptions
Main-thread computation may be acceptable when measured duration is safely within responsiveness budgets.

## Verification
Run supported-browser tests, performance traces, CSP/security checks, unsupported-feature tests, and inspect network delivery headers and caching behavior.