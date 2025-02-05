import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

class JwtToken {
  static createJwt(
    data: string | Buffer | object,
    secretKey: string,
    options?: SignOptions
  ): string {
    try {
      return jwt.sign(data, secretKey, options || {});
    } catch (error) {
      throw new Error("Failed to create JWT");
    }
  }

//   static verifyJwt<T extends JwtPayload | string>(
//     token: string,
//     secretKey: string
//   ): T | null {
//     try {
//       return jwt.verify(token, secretKey) as T;
//     } catch {
//       return null;
//     }
//   }
}

export default JwtToken;
