export interface PostBody {
  userid: string;
  lastname: string;
  firstname: string;
  birthdate: Date;
  country: string;
  city: string;
  postalcode: number;
  address: string;
}

export interface UserData extends PostBody {
  username: string;
  privileges: string;
  email: string;
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
  iat: number;
  exp: number;
}
