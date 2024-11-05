import { RegionModel } from "../models/models";
import { IRegion } from "../interfaces/regions";

class RegionsServices {
  public getRegions = async (lat: string, lng: string) => {
    const lngValue = parseFloat(lng);
    const latValue = parseFloat(lat);

    const regions = await RegionModel.find({
      coordinates: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [lngValue, latValue],
          },
        },
      },
    }).lean();

    return regions;
  };

  public getRegionsNear = async (
    lat: string,
    lng: string,
    distance: string,
    user: string,
  ) => {
    const lngValue = parseFloat(lng);
    const latValue = parseFloat(lat);
    const maxDistance = parseFloat(distance);

    const query: any = {
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lngValue, latValue],
          },
          $maxDistance: maxDistance,
        },
      },
    };

    if (user) {
      query.user = { $ne: user };
    }

    const regions = await RegionModel.find(query);

    return regions;
  };

  public createRegion = async (create: IRegion) => {
    const region = new RegionModel(create);
    const savedRegion = await region.save();
    return savedRegion;
  };

  public updateCompleteRegion = async (id: string, update: IRegion) => {
    const region = await RegionModel.findOne({ _id: id });

    if (region) {
      region.name = update.name;
      region.coordinates = update.coordinates;

      await region.save();
    }

    return region.toObject();
  };

  public updateRegion = async (id: string, update: IRegion) => {
    const region = await RegionModel.findOne({ _id: id });

    if (region) {
      if (update.name) region.name = update.name;
      if (update.coordinates) region.coordinates = update.coordinates;

      await region.save();
    }

    return region.toObject();
  };

  public deleteRegion = async (id: string) => {
    await RegionModel.deleteOne({ _id: id });
  };
}

export default RegionsServices;
