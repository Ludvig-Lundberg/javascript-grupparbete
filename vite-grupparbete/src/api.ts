import { IOrder, IResponse } from './interfaces'

export const createOrder = async (order : IOrder) => {
	const res = await fetch("https://bortakvall.se/api/orders", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(order)
	})

	// Check that everything went ok
	if (!res.ok) {
		console.log(`Could not create a new order, reason: ${res.status} ${res.statusText}`)

		throw new Error(`Could not create a new order, reason: ${res.status} ${res.statusText}`)
	}

	return await res.json() as IResponse

}

export const fetchItems = async () => {
	const res = await fetch("https://bortakvall.se/api/products")

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`)
	}

	return await res.json()
	
}