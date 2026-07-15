import { createHmac, timingSafeEqual } from "crypto";

export function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const computed = signPayload(payload, secret);
    const computedBuffer = Buffer.from(computed);
    const signatureBuffer = Buffer.from(signature);
    
    if (computedBuffer.length !== signatureBuffer.length) {
      return false;
    }
    
    return timingSafeEqual(computedBuffer, signatureBuffer);
  } catch {
    return false;
  }
}
