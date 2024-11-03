export interface IUser {
  name: string;
  email: string;
  address: string | undefined;
  coordinates: [number, number] | undefined;
}

export interface IGetUsers {
  rows: IUser[];
  pageValue: string | undefined;
  limitValue: string | undefined;
  total: number;
}
