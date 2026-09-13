import { z } from "zod";

export const Id = z.object({ id: z.string().regex(/^\d+$/, "id must be numeric") });
export const Page = z.object({ page: z.number().int().min(1).max(10000).default(1), pageSize: z.number().int().min(1).max(100).default(20) });
export const StoreList = Page;
export const ProductList = Page.extend({ storeId: z.string().regex(/^\d+$/).optional() });
export const VariantList = Page.extend({ productId: z.string().regex(/^\d+$/).optional(), status: z.enum(["pending", "draft", "published"]).optional() });
export const CustomerList = Page.extend({ storeId: z.string().regex(/^\d+$/).optional(), email: z.string().email().optional() });
export const OrderList = Page.extend({ storeId: z.string().regex(/^\d+$/).optional(), userEmail: z.string().email().optional() });
export const SubscriptionList = Page.extend({
  storeId: z.string().regex(/^\d+$/).optional(),
  userEmail: z.string().email().optional(),
  status: z.enum(["on_trial", "active", "paused", "past_due", "unpaid", "cancelled", "expired"]).optional()
});

const country = z.string().regex(/^[A-Z]{2}$/, "country must be ISO 3166-1 alpha-2").optional();
export const CustomerCreate = z.object({
  storeId: z.string().regex(/^\d+$/),
  name: z.string().trim().min(1).max(255),
  email: z.string().email(),
  city: z.string().trim().max(255).optional(),
  region: z.string().trim().max(255).optional(),
  country,
  approved: z.literal(true)
});
export const CustomerUpdate = z.object({
  id: z.string().regex(/^\d+$/),
  name: z.string().trim().min(1).max(255).optional(),
  email: z.string().email().optional(),
  city: z.string().trim().max(255).nullable().optional(),
  region: z.string().trim().max(255).nullable().optional(),
  country: z.union([z.string().regex(/^[A-Z]{2}$/), z.null()]).optional(),
  status: z.literal("archived").optional(),
  approved: z.literal(true)
}).refine((v) => [v.name, v.email, v.city, v.region, v.country, v.status].some((x) => x !== undefined), "at least one customer attribute is required");

export const SubscriptionUpdate = z.object({
  id: z.string().regex(/^\d+$/),
  variantId: z.number().int().positive().optional(),
  cancelled: z.boolean().optional(),
  trialEndsAt: z.string().datetime({ offset: true }).nullable().optional(),
  billingAnchor: z.number().int().min(0).max(31).nullable().optional(),
  pause: z.union([
    z.object({ mode: z.enum(["void", "free"]), resumesAt: z.string().datetime({ offset: true }).optional() }),
    z.null()
  ]).optional(),
  invoiceImmediately: z.boolean().optional(),
  disableProrations: z.boolean().optional(),
  approved: z.literal(true)
}).refine((v) => [v.variantId, v.cancelled, v.trialEndsAt, v.billingAnchor, v.pause, v.invoiceImmediately, v.disableProrations].some((x) => x !== undefined), "at least one subscription attribute is required");
