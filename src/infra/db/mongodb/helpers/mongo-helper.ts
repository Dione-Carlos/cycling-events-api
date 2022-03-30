import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect(): Promise<void> {
    await this.client?.close()

    this.client = null
  },

  async getCollection(name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },

  map: (collection: any): any => {
    if (!collection) return null

    const { _id, ...collectionWithoutId } = collection

    return Object.assign({}, { id: _id }, collectionWithoutId)
  }
}
