import "reflect-metadata";
import * as mongoose from "mongoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  modelOptions,
  index,
} from "@typegoose/typegoose";
import lib from "../libs/geolib";
import ObjectId = mongoose.Types.ObjectId;

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@pre<User>("save", async function (next) {
  const region = this as Omit<any, keyof User> & User;

  if (region.isModified("coordinates")) {
    region.address = await lib.getAddressFromCoordinates(region.coordinates);
  } else if (region.isModified("address")) {
    const { lat, lng } = await lib.getCoordinatesFromAddress(region.address);
    region.coordinates = [lng, lat];
  }

  next();
})
export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop()
  address: string;

  @Prop({ type: () => [Number] })
  coordinates: [number, number];

  @Prop({ required: true, default: [], ref: () => Region, type: () => String })
  regions: Ref<Region>[];

  public static async count(): Promise<number> {
    const UserModel = getModelForClass(User);
    return UserModel.countDocuments();
  }
}

@index({ coordinates: "2dsphere" })
@pre<Region>("save", async function (next) {
  const region = this as Omit<any, keyof Region> & Region;

  if (!region._id) {
    region._id = new ObjectId().toString();
  }

  if (region.isNew) {
    const user = await UserModel.findOne({ _id: region.user });

    if (!user.regions) {
      user.regions = [];
    }

    user.regions.push(region._id);
    await user.save({ session: region.$session() });
  }

  next(region.validateSync());
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region extends Base {
  @Prop({ required: true, auto: true })
  _id: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;

  @Prop({
    required: true,
  })
  coordinates: {
    type: string;
    coordinates: number[][][];
  };
}

export const UserModel = getModelForClass(User);
export const RegionModel = getModelForClass(Region);
