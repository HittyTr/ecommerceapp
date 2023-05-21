export type User={
  name:string,
  email:string,
  id:string,
  photoUrl:string
}
export type NewUser={
  name:string,
  email:string,
  id:string,
  photoUrl:string,
  password:string
}
export type Product = {
  id:string,
  title:string,
  description:string,
  image:string,
  price:number,
  category:number,
  subcategory:number,
  stock:number
}


export type Category = {
  id: string;
  name: string;
}