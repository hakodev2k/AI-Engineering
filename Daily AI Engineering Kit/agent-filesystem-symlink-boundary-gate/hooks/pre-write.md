# Hook: Pre Write

## Trigger
Immediately before each write batch.

## Preconditions
Exact target paths have been enumerated.

## Action
Write target paths to an input file and run `python scripts/path_boundary_gate.py --root <root> --paths-file <input> --output <report>`.

## Expected result
Every target is lexically and physically contained within the trusted root.

## Failure behavior
Any violation blocks the write. Do not change root/permissions or bypass links automatically. Revalidate at most twice if topology changed transiently.

## Blocking
Yes.