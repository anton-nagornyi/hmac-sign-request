export const quoteQuery = (query: any) => Object.fromEntries(Object.entries(query).map(([k, v]) => [k, (v as any).toString()]));
