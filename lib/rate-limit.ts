// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function rateLimit(ip: string, route: string): Promise<{ success: boolean; limit: number; remaining: number }> {
  // Simple pass-through implementation
  return {
    success: true,
    limit: 100,
    remaining: 99
  };
}
