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
		// confirmationEl.innerHTML = `Kunde tyvärr inte skapa en ny order ${res.statusText}.`

		throw new Error(`Kunde tyvärr inte lägga en ny order på grund utav: ${res.status} ${res.statusText}`)
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