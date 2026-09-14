export function validateCollectionName(name: string): void {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(name)) {
    throw new Error('Collection name must be 1-128 characters and contain only letters, digits, dot, underscore, or hyphen');
  }
}

export function validateBatch(ids: string[], max: number, documents?: string[], metadatas?: Record<string, unknown>[], embeddings?: number[][]): void {
  if (ids.length === 0) throw new Error('ids must not be empty');
  if (ids.length > max) throw new Error(`Batch size exceeds configured maximum of ${max}`);
  if (new Set(ids).size !== ids.length) throw new Error('ids must be unique within a request');
  if (ids.some((id) => id.length === 0 || id.length > 512)) throw new Error('Each id must be 1-512 characters');
  if (documents && documents.length !== ids.length) throw new Error('documents length must match ids length');
  if (metadatas && metadatas.length !== ids.length) throw new Error('metadatas length must match ids length');
  if (embeddings && embeddings.length !== ids.length) throw new Error('embeddings length must match ids length');
  if (documents?.some((d) => d.length > 1_000_000)) throw new Error('Each document is limited to 1,000,000 characters by this connector');
}

export function validatePage(limit?: number, offset?: number): void {
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 500)) throw new Error('limit must be between 1 and 500');
  if (offset !== undefined && (!Number.isInteger(offset) || offset < 0)) throw new Error('offset must be a non-negative integer');
}
