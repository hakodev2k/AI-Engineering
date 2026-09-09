export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export type PolicyOptions = {
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

export function authorize(risk: Risk, approved: boolean | undefined, options: PolicyOptions): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !options.destructiveEnabled) {
    throw new Error('Destructive tools are disabled. Set KEAP_DESTRUCTIVE_ENABLED=true only after explicit operator decision.');
  }
  const required = risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || options.requireWriteApproval;
  if (required && approved !== true) throw new Error(`Human approval is required for ${risk} operation.`);
}
