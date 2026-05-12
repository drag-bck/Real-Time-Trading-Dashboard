import jwt from "jsonwebtoken";
import { config } from "./config";

export interface AuthPayload {
  sub: string;
  name: string;
}

export function issueToken(username: string) {
  return jwt.sign({ sub: username, name: username } satisfies AuthPayload, config.jwtSecret, {
    expiresIn: "12h",
  });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as AuthPayload;
  } catch {
    return null;
  }
}
