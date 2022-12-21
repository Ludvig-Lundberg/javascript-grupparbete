import './style.css'

export const fetchItems = async () => {
	const res = await fetch("https://bortakvall.se/api/products")

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`)
	}

	return await res.json() 
	
}