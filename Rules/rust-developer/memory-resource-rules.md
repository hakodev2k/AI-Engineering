# Memory and Resource Management

## Purpose
Keep memory, file descriptors, sockets, handles, and other resources bounded and correctly released.

## Scope
Heap allocation, RAII guards, pools, buffers, files, sockets, and native handles.

## MUST
- Resource ownership MUST be explicit and cleanup MUST be deterministic where resource exhaustion is possible.
- Buffers and collections fed by external input MUST have defensible bounds.
- Resource pools MUST define maximum capacity, acquisition timeout, and failure behavior.
- Custom `Drop` behavior affecting correctness MUST be documented and tested.

## MUST NOT
- MUST NOT rely on process termination as routine resource cleanup.
- MUST NOT create unbounded caches, queues, buffers, or retained object graphs.
- MUST NOT perform fallible critical business operations only from `Drop`.

## SHOULD
- Prefer RAII guards and scoped ownership.
- Reuse allocations only when measurement shows benefit and lifecycle complexity remains controlled.

## Exceptions
Intentional process-lifetime resources require documented boundedness and shutdown implications.

## Verification
Use leak/resource tests, load tests, memory profiling, descriptor metrics, and review of all unbounded collection growth paths.