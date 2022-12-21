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
    stock_quantity: null
  }

  export interface IDetails {
    firstname: string,
    lastname: string,
    email: string,
    phonenumber?: number,
    address: string,
    zip: number,
    city: string,
}