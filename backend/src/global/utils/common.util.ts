import * as bcrypt from 'bcrypt';

const hash = async (plainText: string, saltOrRounds: number = 10): Promise<string> => {
  return await bcrypt.hash(plainText, saltOrRounds);
};

const checkHash = async (plainText: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(plainText, hash);
};

export { hash, checkHash };
