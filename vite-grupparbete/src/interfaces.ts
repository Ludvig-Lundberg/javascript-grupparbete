export interface ICartItem {
    item_name?: string,
    product_id: number,
    qty: number,
    item_price: number,
    item_total: number,
    stock_qty?: number
}

export interface IItem {
    id: number,
    name: string,
    description: string,
    price: number,
    on_sale: boolean,
    images: {
        thumbnail: string,
        large: string
    },
    stock_status: string,
    stock_quantity: number
  }

export interface IOrder {
    customer_first_name: string,
    customer_last_name: string,
    customer_address: string,
    customer_postcode: string,
    customer_city: string,
    customer_email: string,
    customer_phone?: string,
    order_total: number,
    order_items: Array<ICartItem>
}

export interface IReturnItem {
    id: number,
    order_id: number,
    product_id: number,
    qty: number,
    item_price: number,
    item_total: number
}

export interface IResponse {
    status: string,
    data: {
        id: number,
        order_date: string,
        customer_first_name: string,
        customer_last_name: string,
        customer_address: string,
        customer_postcode: string,
        customer_email: string,
        customer_phone?: string,
        order_total: number,
        created_at: string,
        updated_at: string,
        items: Array<IReturnItem>
    }
}