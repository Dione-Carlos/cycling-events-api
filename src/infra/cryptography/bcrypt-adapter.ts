import bcrypt from 'bcrypt'
import { Harsher } from '../../data/protocols/cryptography/harsher'

export class BcryptAdapter implements Harsher {
  constructor(private readonly salt: number) {
    this.salt = salt
  }

  async harsh(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
