# Model Architecture Change Rules

## Purpose
Control architectural changes that affect trainability, compatibility, capability, and downstream systems.

## Scope
Attention, normalization, positional methods, routing, experts, embeddings, depth/width, activations, parameter sharing, and context mechanisms.

## MUST
- Significant architecture changes MUST document the hypothesis, expected trade-offs, compatibility impact, and validation plan.
- Tensor shapes, initialization, parameter counts, FLOPs, memory, and checkpoint serialization MUST be validated before large runs.
- Architecture changes MUST be tested for training stability and downstream inference/export support.
- Continued-training changes MUST define how old parameters map into the new architecture and how unmapped state is initialized.
- Breaking checkpoint or serving changes MUST receive human approval before production adoption.

## MUST NOT
- MUST NOT introduce architecture complexity without evidence of benefit commensurate with operational cost.
- MUST NOT silently reinterpret existing checkpoint tensors.
- MUST NOT claim an architectural improvement from a comparison confounded by materially different data or compute without qualification.

## SHOULD
- Changes SHOULD be ablated at smaller scale before full training.
- Architecture choices SHOULD consider inference latency, memory, quantization, and tooling support early.

## Exceptions
Pure research prototypes may defer serving compatibility but must be clearly isolated from release candidates.

## Verification
Inspect design records, shape/serialization tests, parameter/FLOP reports, ablations, stability curves, conversion tests, and serving compatibility evidence.