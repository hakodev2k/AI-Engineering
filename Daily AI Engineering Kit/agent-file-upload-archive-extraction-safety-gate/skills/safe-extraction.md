# Safe Extraction

## Purpose
Extract only an archive that has passed deterministic safety validation.

## Inputs
Validated archive, successful scan result, isolated destination.

## Preconditions
- Scan status is `pass` from the same archive bytes.
- Destination is not a production-served directory.
- Caller has least-privilege write access.

## Process
1. Recompute or otherwise preserve archive identity between scan and extraction.
2. Use `python scripts/archive_safety_gate.py <archive> --policy config/archive-policy.yaml --extract-to <destination>`.
3. The script recomputes target paths and enforces containment before each write.
4. Inspect extracted file types before downstream parsing or execution.
5. Move accepted output into its final location only through an application-controlled operation.

## Forbidden shortcuts
Do not call `ZipFile.extractall`, OS archive utilities, or third-party extractors directly on untrusted input unless they enforce equivalent containment and resource limits.

## Verification
Confirm destination contains only expected normalized paths and no extraction target escaped its root.

## Failure handling
Delete/quarantine the isolated extraction directory only after explicit operator/application authorization. Preserve scan evidence first.

## Stop conditions
Any mismatch between the scanned archive and extracted input, target containment failure, or downstream file-type violation stops the workflow.
