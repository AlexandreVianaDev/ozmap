import { faker } from "@faker-js/faker";
import { User, UserModel } from "../../models/models";

class UsersBuilders {
  public build = async () => {
    const userData: Omit<User, "_id" | "coordinates"> = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      regions: [],
    };
    const user = await UserModel.create(userData);

    return user;
  };
}

export default UsersBuilders;
