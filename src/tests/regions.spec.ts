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
import RegionsServices from "../services/regions";

describe("Region Tests", function () {
  let user;
  let region;
  let session;
  let geoLibStub: Partial<typeof GeoLib> = {};
  let regionService;

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

    regionService = new RegionsServices();
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

  describe("Region Unit", () => {
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

    describe("getRegions", () => {
      it("Should return regions with the point", async () => {
        const lng = region.coordinates.coordinates[0][0][0];
        const lat = region.coordinates.coordinates[0][0][1];

        const regions = await regionService.getRegions(lat, lng);

        expect(regions.length).to.be.above(1);
      });
    });

    describe("getRegionsNear", () => {
      it("Should return regions near to the point", async () => {
        const lng = region.coordinates.coordinates[0][0][0];
        const lat = region.coordinates.coordinates[0][0][1];
        const distance = "5000";
        const userId = user._id;

        const regions = await regionService.getRegionsNear(
          lat,
          lng,
          distance,
          userId,
        );

        expect(regions.length).to.be.above(1);
      });

      it("Should return regions not owned by user", async () => {
        const lat = "10.0";
        const lng = "20.0";
        const distance = "5000";
        const userId = user._id;

        const regions = await regionService.getRegionsNear(
          lat,
          lng,
          distance,
          userId,
        );

        const regionsOwned = regions.filter(
          (region) => region.user == user._id,
        );

        expect(regionsOwned).to.deep.equal([]);
      });
    });

    describe("createRegion", () => {
      it("Should create new region", async () => {
        const firstPoint = generateCoordinate();
        const regionData = {
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

        const region = await regionService.createRegion(regionData);
        expect(region.toObject())
          .to.have.property("name")
          .equals(regionData.name);
      });
    });

    describe("updateRegion", () => {
      it("Should update the region", async () => {
        const firstPoint = generateCoordinate();
        const regionData = {
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

        const regionUpdated = await regionService.updateRegion(
          region._id,
          regionData,
        );
        expect(regionUpdated.name).to.equal(regionData.name);
      });
    });

    describe("deleteRegion", () => {
      it("Should delete the region", async () => {
        const id = region._id;

        await regionService.deleteRegion(id);
      });
    });
  });

  describe("Region Integation", () => {
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
      const regionData = {
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
      const regionToupdate = await RegionModel.create(regionData);

      const firstNewPoint = generateCoordinate();
      const body = {
        update: {
          user: user._id,
          name: "Region 1",
          coordinates: {
            type: "Polygon",
            coordinates: [
              [
                firstNewPoint,
                generateCoordinate(),
                generateCoordinate(),
                firstNewPoint,
              ],
            ],
          },
        },
      };

      const response = await supertest(server)
        .put(`/regions/${regionToupdate._id}`)
        .send(body);

      expect(response).to.have.property("status", STATUS.UPDATED);
    });

    it("should delete a region", async () => {
      const firstPoint = generateCoordinate();
      const regionData = {
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
      const regionToDelete = await RegionModel.create(regionData);

      const response = await supertest(server).delete(
        `/regions/${regionToDelete._id}`,
      );

      expect(response).to.have.property("status", STATUS.OK);
    });
  });
});
