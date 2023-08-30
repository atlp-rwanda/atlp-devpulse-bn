import { genSaltSync, hashSync, compareSync } from "bcrypt";

export default class BcryptUtil {
  static hash(string: any) {
    const pasSalt = genSaltSync(10, "b");
    const pasHash = hashSync(string, pasSalt);
    return pasHash;
  }

  static compare(value1: any, value2: any) {
    const validPass = compareSync(value1, value2);
    return validPass;
  }
}
