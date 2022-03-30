import bcrypt from 'bcrypt'
import { Harsher } from '../../../data/protocols/cryptography/harsher'
import { HashComparer } from '../../../data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Harsher, HashComparer {
  constructor(private readonly salt: number) { }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
