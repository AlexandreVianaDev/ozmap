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

describe("Models", function () {
  let user;
  let session;
  let geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    geoLibStub.getAddressFromCoordinates = sinon
      .stub(GeoLib, "getAddressFromCoordinates")
      .resolves(faker.location.streetAddress({ useFullAddress: true }));
    geoLibStub.getCoordinatesFromAddress = sinon
      .stub(GeoLib, "getCoordinatesFromAddress")
      .resolves({
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      });

    init();
    session = await mongoose.startSession();

    user = await UserModel.create({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress({ useFullAddress: true }),
    });
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

  describe("UserModel", () => {
    it("should create a user", async () => {
      const body = {
        create: {
          name: "Alexandre",
          email: "alexandre@mail.com",
          address: "Rua dos bobos 0",
        },
      };

      const response = await supertest(server).post(`/users`).send(body);

      expect(response).to.have.property("status", STATUS.CREATED);
    });

    it("should return a list of users", async () => {
      const response = await supertest(server).get(`/users`);

      expect(response).to.have.property("status", STATUS.OK);
    });

    it("should return a user", async () => {
      const response = await supertest(server).get(`/users/${user._id}`);

      expect(response).to.have.property("status", STATUS.OK);
    });

    it("should update a user", async () => {
      const body = {
        update: {
          name: "Alexandre",
          email: "alexandre@mail.com",
          address: "Rua dos bobos 0",
        },
      };

      const response = await supertest(server)
        .put(`/users/${user._id}`)
        .send(body);

      expect(response).to.have.property("status", STATUS.UPDATED);
    });

    it("should delete a user", async () => {
      const response = await supertest(server).delete(`/users/${user._id}`);

      expect(response).to.have.property("status", STATUS.OK);
    });
  });

  describe("RegionModel", () => {
    it("should create a region", async () => {
      const regionData: Omit<Region, "_id"> = {
        user: user._id,
        name: faker.person.fullName(),
      };

      const [region] = await RegionModel.create([regionData]);

      expect(region).to.deep.include(regionData);
    });

    it("should rollback changes in case of failure", async () => {
      const userRecord = await UserModel.findOne({ _id: user._id })
        .select("regions")
        .lean();
      try {
        await RegionModel.create([{ user: user._id }]);

        assert.fail("Should have thrown an error");
      } catch (error) {
        const updatedUserRecord = await UserModel.findOne({ _id: user._id })
          .select("regions")
          .lean();

        expect(userRecord).to.deep.eq(updatedUserRecord);
      }
    });
  });
});
