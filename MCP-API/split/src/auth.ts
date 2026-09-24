export function adminKey(env=process.env){const k=env.SPLIT_ADMIN_API_KEY?.trim();if(!k)throw new Error("SPLIT_ADMIN_API_KEY is required");return k;}
