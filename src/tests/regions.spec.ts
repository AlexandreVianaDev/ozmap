import "reflect-metadata";

import * as mongoose from "mongoose";
import * as supertest from "supertest";
import * as sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect, assert } from "chai";

import "../database/database";
import { Region, RegionModel, UserModel } from "../models/models";
import GeoLib from "../libs/geolib";
import server from "../server";
import init from "../database/database";
import STATUS from "../constants/status";
import generateCoordinate from "./builders/coordinates";

describe("Regions", function () {
  let user;
  let region;
  let session;
  let geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    geoLibStub.getAddressFromCoordinates = sinon
      .stub(GeoLib, "getAddressFromCoordinates")
      .resolves(faker.location.streetAddress({ useFullAddress: true }));
    geoLibStub.getCoordinatesFromAddress = sinon
      .stub(GeoLib, "getCoordinatesFromAddress")
      .resolves({
        lng: faker.location.longitude({ min: -180, max: 180 }),
        lat: faker.location.latitude({ min: -90, max: 90 }),
      });

    init();
    session = await mongoose.startSession();

    const userData = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      regions: [],
    };
    user = await UserModel.create(userData);

    const firstPoint = generateCoordinate();
    const regionData = {
      user: user._id,
      name: faker.person.fullName(),
      coordinates: {
        type: "Polygon",
        coordinates: [
          [firstPoint, generateCoordinate(), generateCoordinate(), firstPoint],
        ],
      },
    };
    region = await RegionModel.create(regionData);
  });

  after(() => {
    sinon.restore();
    if (session) {
      session.endSession();
    }
  });

  beforeEach(() => {
    session.startTransaction();
  });

  afterEach(() => {
    session.commitTransaction();
  });

  describe("RegionModel", () => {
    it("should create a region", async () => {
      const firstPoint = generateCoordinate();
      const regionData: Omit<Region, "_id"> = {
        user: user._id,
        name: faker.person.fullName(),
        coordinates: {
          type: "Polygon",
          coordinates: [
            [
              firstPoint,
              generateCoordinate(),
              generateCoordinate(),
              firstPoint,
            ],
          ],
        },
      };

      const region = await RegionModel.create(regionData);

      expect(region).to.deep.include(regionData);
    });

    it("should rollback changes in case of failure", async () => {
      const userRecord = await UserModel.findOne({ _id: user._id })
        .select("regions")
        .lean();
      try {
        await session.withTransaction(async () => {
          await RegionModel.create([{ user: user._id }], { session });
        });

        assert.fail("Should have thrown an error");
      } catch (error) {
        session.abortTransaction();
        const updatedUserRecord = await UserModel.findOne({ _id: user._id })
          .select("regions")
          .lean();

        expect(userRecord).to.deep.eq(updatedUserRecord);
      }
    });
  });

  describe("RegionIntegration", () => {
    it("should create a region", async () => {
      const firstPoint = generateCoordinate();

      const body = {
        create: {
          user: user._id,
          name: "Region 1",
          coordinates: {
            type: "Polygon",
            coordinates: [
              [
                firstPoint,
                generateCoordinate(),
                generateCoordinate(),
                firstPoint,
              ],
            ],
          },
        },
      };

      const response = await supertest(server).post(`/regions`).send(body);

      expect(response).to.have.property("status", STATUS.CREATED);
    });

    it("should return a list of regions", async () => {
      const lng = region.coordinates.coordinates[0][0][0];
      const lat = region.coordinates.coordinates[0][0][1];

      const response = await supertest(server).get(
        `/regions?lng=${lng}&lat=${lat}`,
      );

      expect(response).to.have.property("status", STATUS.OK);
    });

    it("should update a region", async () => {
      const firstPoint = generateCoordinate();
      const body = {
        update: {
          user: user._id,
          name: "Region 1",
          coordinates: {
            type: "Polygon",
            coordinates: [
              [
                firstPoint,
                generateCoordinate(),
                generateCoordinate(),
                firstPoint,
              ],
            ],
          },
        },
      };

      const response = await supertest(server)
        .put(`/regions/${region._id}`)
        .send(body);

      expect(response).to.have.property("status", STATUS.UPDATED);
    });

    it("should delete a region", async () => {
      const response = await supertest(server).delete(`/regions/${region._id}`);

      expect(response).to.have.property("status", STATUS.OK);
    });
  });
});