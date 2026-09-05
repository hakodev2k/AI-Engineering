# Training Configuration Rules

## Purpose
Make training runs reproducible, reviewable, and resistant to accidental configuration drift.

## Scope
Model architecture, optimizer, scheduler, precision, batch construction, sequence length, regularization, distributed settings, and run parameters.

## MUST
- Every consequential training parameter MUST be captured in version-controlled or immutable run configuration.
- Resolved configuration, code revision, dataset versions, environment image, and random seeds MUST be recorded at run start.
- Defaults that materially affect training MUST be made visible in the resolved configuration.
- Configuration validation MUST reject incompatible or unsafe combinations before expensive compute starts.
- Release candidate checkpoints MUST be traceable to an exact resolved configuration.

## MUST NOT
- MUST NOT rely on shell history or operator memory as the source of truth.
- MUST NOT silently change defaults between comparable experiments.
- MUST NOT mutate a running experiment's declared configuration without recording the change and its time.

## SHOULD
- Configurations SHOULD support schema validation and typed constraints.
- Large experiments SHOULD be dry-run with shape, data, checkpoint, and logging validation first.

## Exceptions
Interactive debugging may use ad hoc settings, but such runs MUST NOT be promoted as reproducible release evidence.

## Verification
Compare run metadata against repository revision, configuration schema, dataset manifests, container/environment digest, and experiment tracking records.