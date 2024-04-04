export interface PostBody {
  userid: string;
  lastname: string;
  firstname: string;
  birthdate: Date;
  country: string;
  city: string;
  postalcode: string;
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
