import { z } from 'zod';
import type { FormstackClient } from './client.js';
import type { Config } from './config.js';
import { authorize, assertSafeWebhookUrl, type Risk } from './policy.js';

const positiveId = z.number().int().positive();
const approval = { approved: z.boolean().optional() };
const page = {
  pageNumber: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(10).max(500).optional()
};

export type ToolRegistrar = {
  registerTool(name: string, definition: any, handler: (args: any) => Promise<any>): void;
};

function response(value: unknown) {
  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({ provider: 'formstack', untrusted_data: true, result: value }, null, 2)
    }]
  };
}

export function registerTools(server: ToolRegistrar, api: FormstackClient, cfg: Config): string[] {
  const names: string[] = [];
  const reg = (
    name: string,
    purpose: string,
    risk: Risk,
    inputSchema: Record<string, z.ZodTypeAny>,
    run: (args: any) => Promise<unknown>
  ) => {
    names.push(name);
    server.registerTool(name, {
      description: `${purpose} Permission=${risk}. ${risk === 'READ' ? 'No approval required.' : 'Human approval may be required by policy.'}`,
      inputSchema
    }, async (args: any) => {
      try {
        authorize(risk, args.approved, cfg);
        return response(await run(args));
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: error instanceof Error ? error.message : 'Unknown error' }]
        };
      }
    });
  };

  reg('formstack.form.list', 'List and search forms with bounded pagination.', 'READ', {
    ...page,
    search: z.string().max(200).optional(),
    orderBy: z.string().max(64).optional(),
    order: z.enum(['ASC', 'DESC']).optional(),
    folder: positiveId.optional()
  }, a => api.request('GET', '/forms', undefined, a));

  reg('formstack.form.get', 'Get one form and optionally include its fields.', 'READ', {
    formId: positiveId,
    withFields: z.boolean().optional()
  }, a => api.request('GET', `/forms/${a.formId}`, undefined, { withFields: a.withFields }));

  reg('formstack.form.create', 'Create a form with a constrained set of supported properties.', 'WRITE', {
    name: z.string().min(1).max(255),
    folder: positiveId.optional(),
    submitButtonTitle: z.string().max(100).optional(),
    numberOfColumns: z.number().int().min(1).max(4).optional(),
    fieldLabelsPosition: z.enum(['top', 'left', 'right']).optional(),
    saveSubmissionsToDatabase: z.boolean().optional(),
    timezone: z.string().max(64).optional(),
    language: z.string().max(16).optional(),
    isActive: z.boolean().optional(),
    disabledMessage: z.string().max(1000).optional(),
    ...approval
  }, a => {
    const { approved, ...body } = a;
    return api.request('POST', '/forms', body);
  });

  reg('formstack.form.update', 'Update common form settings.', 'WRITE', {
    formId: positiveId,
    name: z.string().min(1).max(255).optional(),
    submitButtonTitle: z.string().max(100).optional(),
    saveSubmissionsToDatabase: z.boolean().optional(),
    timezone: z.string().max(64).optional(),
    language: z.string().max(16).optional(),
    isActive: z.boolean().optional(),
    disabledMessage: z.string().max(1000).optional(),
    ...approval
  }, a => {
    const { formId, approved, ...body } = a;
    return api.request('PUT', `/forms/${formId}`, body);
  });

  reg('formstack.form.delete', 'Permanently delete a form.', 'DESTRUCTIVE', {
    formId: positiveId,
    ...approval
  }, a => api.request('DELETE', `/forms/${a.formId}`));

  reg('formstack.field.list', 'List fields belonging to a form.', 'READ', {
    formId: positiveId
  }, a => api.request('GET', `/forms/${a.formId}/fields`));

  reg('formstack.field.create', 'Create a supported field on a form.', 'WRITE', {
    formId: positiveId,
    label: z.string().min(1).max(255),
    type: z.enum(['text', 'textarea', 'email', 'number', 'select', 'radio', 'checkbox', 'name', 'phone', 'address', 'date', 'time', 'file']).optional(),
    internalLabel: z.string().max(255).optional(),
    supportingText: z.string().max(2000).optional(),
    required: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    hidden: z.boolean().optional(),
    unique: z.boolean().optional(),
    hideLabel: z.boolean().optional(),
    columnSpan: z.number().int().min(1).max(4).optional(),
    defaultValue: z.string().max(5000).optional(),
    ...approval
  }, a => {
    const { formId, approved, ...body } = a;
    return api.request('POST', `/forms/${formId}/fields`, body);
  });

  reg('formstack.field.update', 'Update common field settings.', 'WRITE', {
    formId: positiveId,
    fieldId: positiveId,
    label: z.string().min(1).max(255).optional(),
    supportingText: z.string().max(2000).optional(),
    required: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    hidden: z.boolean().optional(),
    unique: z.boolean().optional(),
    hideLabel: z.boolean().optional(),
    defaultValue: z.string().max(5000).optional(),
    ...approval
  }, a => {
    const { formId, fieldId, approved, ...body } = a;
    return api.request('PUT', `/forms/${formId}/fields/${fieldId}`, body);
  });

  reg('formstack.field.delete', 'Permanently delete a field from a form.', 'DESTRUCTIVE', {
    formId: positiveId,
    fieldId: positiveId,
    ...approval
  }, a => api.request('DELETE', `/forms/${a.formId}/fields/${a.fieldId}`));

  reg('formstack.submission.list', 'List submissions for a form with bounded pagination and search.', 'READ', {
    formId: positiveId,
    ...page,
    order: z.enum(['ASC', 'DESC']).optional(),
    keyword: z.string().max(500).optional(),
    minTime: z.string().max(32).optional(),
    maxTime: z.string().max(32).optional(),
    data: z.boolean().optional(),
    expandData: z.boolean().optional(),
    prettyName: z.boolean().optional(),
    dataFormat: z.enum(['legacy', 'standardized']).optional()
  }, a => {
    const { formId, ...query } = a;
    return api.request('GET', `/forms/${formId}/submissions`, undefined, query);
  });

  reg('formstack.submission.get', 'Retrieve one submission by ID.', 'READ', {
    submissionId: positiveId
  }, a => api.request('GET', `/submissions/${a.submissionId}`));

  reg('formstack.submission.delete', 'Permanently delete a submission and its associated data.', 'DESTRUCTIVE', {
    submissionId: positiveId,
    ...approval
  }, a => api.request('DELETE', `/submissions/${a.submissionId}`));

  reg('formstack.webhook.list', 'List configured webhooks for a form.', 'READ', {
    formId: positiveId
  }, a => api.request('GET', `/forms/${a.formId}/webhooks`));

  reg('formstack.webhook.create', 'Create an HTTPS webhook that sends future form submissions to an external system.', 'HIGH_RISK', {
    formId: positiveId,
    name: z.string().min(1).max(255),
    url: z.string().url().max(2048),
    contentType: z.enum(['urlencoded', 'json']).optional(),
    fileTransferType: z.enum(['downloadLink', 'signedUrl', 'base64encode']).optional(),
    postDataFieldKeys: z.enum(['field_names', 'field_ids', 'api_friendly_field_names', 'internal_labels', 'internal_labels_api_friendly']).optional(),
    includeFieldType: z.boolean().optional(),
    includeSubfieldNames: z.boolean().optional(),
    standardizeValues: z.boolean().optional(),
    ...approval
  }, a => {
    assertSafeWebhookUrl(a.url);
    const { formId, approved, ...body } = a;
    return api.request('POST', `/forms/${formId}/webhooks`, body);
  });

  reg('formstack.webhook.delete', 'Permanently remove a form webhook.', 'DESTRUCTIVE', {
    formId: positiveId,
    webhookId: positiveId,
    ...approval
  }, a => api.request('DELETE', `/forms/${a.formId}/webhooks/${a.webhookId}`));

  return names;
}
