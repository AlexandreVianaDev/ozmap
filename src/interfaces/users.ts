export interface IUser {
  name: string;
  email: string;
  address: string | undefined;
  coordinates: [number, number] | undefined;
}

export interface IGetUsers {
  rows: IUser[];
  page: string | undefined;
  limit: string | undefined;
  total: number;
}
