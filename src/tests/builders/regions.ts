import { faker } from "@faker-js/faker";
import generateCoordinate from "./coordinates";
import { RegionModel } from "../../models/models";

class RegionsBuilders {
  public build = async (user: string) => {
    const firstPoint = generateCoordinate();
    const regionData = {
      user: user,
      name: faker.person.fullName(),
      coordinates: {
        type: "Polygon",
        coordinates: [
          [firstPoint, generateCoordinate(), generateCoordinate(), firstPoint],
        ],
      },
    };
    const region = await RegionModel.create(regionData);
    return region;
  };
}

export default RegionsBuilders;
