interface Client {
  name: string
  old: number
}

const capitalize = (s: string): string => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const clientList: Client[] = [
  { name: 'Gabriel', old: 28 },
  { name: 'Keila', old: 32 }
]

// { header: 'Id', key: 'id', width: 10 }

const keys = Object.keys(clientList[0])
const columns = keys.map((k) => ({
	header: capitalize(k),
	key: k,
	width: k.length * 2
}))

console.log(keys)
console.log(columns)
