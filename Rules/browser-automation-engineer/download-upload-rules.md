# Download and Upload Rules

## Purpose
Ensure file transfer automation is deterministic, secure, and verifiable.

## Scope
Applies to browser-driven downloads, uploads, generated files, temporary artifacts, and file-selection workflows.

## MUST
- Downloads MUST be correlated to the action that initiated them and validated for expected filename or type, completion, and content characteristics relevant to the scenario.
- Uploaded test files MUST come from controlled fixtures with known content and classification.
- Temporary files MUST have deterministic cleanup and collision-safe naming under parallel execution.
- File paths MUST be resolved independently of a developer workstation's local layout.
- Sensitive downloaded artifacts MUST be protected according to their classification and removed when retention is not required.

## MUST NOT
- Automation MUST NOT treat a download event alone as proof that the downloaded content is correct.
- Untrusted downloaded content MUST NOT be executed automatically.
- Real personal, confidential, or production data MUST NOT be used as an upload fixture unless explicitly authorized and protected.

## SHOULD
- Content hashes or structural validation SHOULD be used when exact file integrity matters.
- Upload fixtures SHOULD be minimal while still representing boundary conditions.

## Exceptions
Large or externally generated files may require alternate validation; document the validation evidence and cleanup strategy.

## Verification
Inspect artifact directories, validate file contents or hashes, run parallel transfers, simulate interrupted transfers, and confirm cleanup and access controls.