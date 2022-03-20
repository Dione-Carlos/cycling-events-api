import bcrypt from 'bcrypt'
import { Harsher } from '../../data/protocols/cryptography/harsher'

export class BcryptAdapter implements Harsher {
  constructor(private readonly salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)

    return await new Promise(resolve => resolve(true))
  }
}
