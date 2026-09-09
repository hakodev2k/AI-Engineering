export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function authorize(risk: Risk, approved: boolean | undefined, cfg: {requireWriteApproval:boolean; destructiveEnabled:boolean}) {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !cfg.destructiveEnabled) throw new Error('Destructive operations are disabled. Set HONEYBADGER_DESTRUCTIVE_ENABLED=true and approve explicitly.');
  if ((risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || cfg.requireWriteApproval) && approved !== true) {
    throw new Error(`Human approval is required for ${risk} operation.`);
  }
}

export function assertMutatingInput(input: Record<string, unknown>, keys: string[]) {
  if (!keys.some(k => Object.prototype.hasOwnProperty.call(input, k))) throw new Error('At least one mutable field must be provided.');
}
