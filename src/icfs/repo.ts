import toCamel from '../utils/to-camel'

export async function gc(client: any){
  const res = await client.fetch(`/api/v0/repo/gc?encoding=json&quiet=true&stream-channels=true`)
  const data = await res.text()
  return data
}
