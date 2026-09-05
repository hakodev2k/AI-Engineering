# Training Scaling Rules

## Purpose
Make scale-up decisions from measured behavior rather than intuition.

## Scope
Model size, token budget, batch size, context length, cluster size, and compute-optimal planning.

## MUST
- Scale-up proposals MUST state the expected capability or efficiency benefit and the evidence supporting it.
- Scaling estimates MUST distinguish model FLOPs, tokens, wall-clock throughput, communication overhead, and total resource cost where relevant.
- Effective batch size and optimizer schedule MUST be revalidated when parallelism or cluster scale changes.
- Large jumps in model or data scale MUST have explicit risk checks for memory, convergence, checkpointing, evaluation, and serving compatibility.
- Scaling-law or proxy-model extrapolations MUST report their observed range and uncertainty.

## MUST NOT
- MUST NOT extrapolate a trend far beyond measured scales and present it as established fact.
- MUST NOT equate higher utilization with better end-to-end training efficiency if convergence or quality worsens.
- MUST NOT ignore downstream inference constraints when training a model intended for a bounded serving envelope.

## SHOULD
- Scale studies SHOULD include multiple points sufficient to detect non-linear behavior.
- Decisions SHOULD optimize useful model quality per constrained resource, not a single systems metric.

## Exceptions
Strategic exploratory scale runs require explicit acknowledgement of weak extrapolation evidence and approved budget risk.

## Verification
Review scaling curves, proxy runs, uncertainty, throughput profiles, batch/schedule calculations, resource estimates, and downstream compatibility checks.