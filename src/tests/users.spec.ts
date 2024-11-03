import "reflect-metadata";

import * as mongoose from "mongoose";
import * as supertest from "supertest";
import * as sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";

import "../database/database";
import { User, UserModel } from "../models/models";
import GeoLib from "../libs/geolib";
import server from "../server";
import init from "../database/database";
import STATUS from "../constants/status";

describe("Users", function () {
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
  });

  after(async () => {
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
      const userData: Omit<User, "_id" | "coordinates"> = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress({ useFullAddress: true }),
        regions: [],
      };
      const user = await UserModel.create(userData);

      expect(user).to.deep.include(userData);
    });
  });

  describe("UserIntegration", () => {
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
});
