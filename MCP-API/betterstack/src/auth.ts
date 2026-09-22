export function token(env=process.env){const value=env.BETTERSTACK_API_TOKEN?.trim();if(!value)throw new Error("BETTERSTACK_API_TOKEN is required");return value;}
