/** biome-ignore-all lint/style/noNonNullAssertion: <env vars are always there> */
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY!);

export const encrypt = (text: string) => cryptr.encrypt(text);
export const decrypt = (text: string) => cryptr.decrypt(text);
