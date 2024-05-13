import type { devicetype } from '@prisma/client';

export interface PostBody {
  userid: string;
  lastname: string;
  firstname: string;
  birthdate: Date;
  country: string;
  city: string;
  postalcode: number;
  address: string;
  email: string;
}

export interface UserData extends PostBody {
  username: string;
  privileges: string;
}

export interface Rating {
  rating: number;
}

export interface Body {
  username: string;
  password: string;
}

export interface UserCookieInfo {
  username: string;
  user_id: string;
  privileges: string;
  iat: number;
  exp: number;
}

export interface OrdersProduct {
  productid: string;
  discountedprice: number;
  name: string;
  releaseyear: number | null;
  color: string | null;
  photo: string[];
  producttype: devicetype;
}

export interface Orders {
  orderid: number;
  orderdate: string;
  fulfilled: boolean;
  deleted: boolean;
}

export interface OrderDetails {
  orderid: number;
  price: number;
  quantity: number;
  total: number;
  products: OrdersProduct;
}
