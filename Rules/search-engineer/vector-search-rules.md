# Vector Search

## Purpose
Use embeddings and approximate nearest-neighbor retrieval with controlled quality, cost, and safety.

## Scope
Embedding generation, vector indexes, ANN configuration, similarity, and hybrid retrieval.

## MUST
- Version embedding model, preprocessing, dimensionality, similarity function, and index parameters together.
- Re-embed or provide a validated compatibility strategy when representation semantics change.
- Measure recall/quality and latency under representative corpus size and filters.
- Define fallback behavior when embedding or vector infrastructure is unavailable.

## MUST NOT
- Compare vectors produced by incompatible embedding spaces without validated alignment.
- Assume ANN tuning is lossless.
- expose restricted content through semantic similarity when keyword access controls would block it.

## SHOULD
- Evaluate hybrid lexical/vector retrieval against either method alone.
- Track embedding drift and corpus coverage.

## Exceptions
Exceptions require benchmark evidence, compatibility analysis, security review where applicable, and rollback.

## Verification
Check model/version metadata, ANN recall tests, latency/load tests, access-control tests, and fallback exercises.