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
import UsersServices from "../services/users";
import UsersBuilders from "./builders/users";

describe("Users Tests", function () {
  let user;
  let session;
  let geoLibStub: Partial<typeof GeoLib> = {};
  let usersServices;
  let usersBuilders;

  before(async () => {
    usersServices = new UsersServices();
    usersBuilders = new UsersBuilders();

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

    user = await usersBuilders.build();
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

  describe("User Unit", () => {
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

    describe("getUsers", () => {
      it("should return users and pagination info", async () => {
        const page = "1";
        const limit = "1";

        const result = await usersServices.getUsers(page, limit);
        expect(result.rows.length).to.be.above(0);
        expect(result.total).to.be.above(0);
      });
    });

    describe("getUser", () => {
      it("should return a user by id", async () => {
        const userFound = await usersServices.getUser(user._id);
        expect(userFound._id).to.deep.equal(user._id);
      });
    });

    describe("updateUser", () => {
      it("should update and return the existing user", async () => {
        const userToUpdate = await usersBuilders.build();
        const userUpdateData = {
          name: "Alexandre",
          email: "alexandre@email.com",
          address: "Rua dos bobos 0",
        };
        const userUpdated = await usersServices.updateUser(
          userToUpdate._id,
          userUpdateData,
        );

        const userDatabase = await UserModel.findOne({
          _id: userToUpdate._id,
        }).lean();

        expect(userUpdated.name).to.equal(userDatabase.name);
        expect(userUpdated.email).to.equal(userDatabase.email);
      });
    });

    describe("createUser", () => {
      it("should create and return the new user", async () => {
        const userData = {
          name: "Alexandre",
          email: "alexandre@mail.com",
          address: "Rua dos bobos 0",
        };
        const userCreated = await usersServices.createUser(userData);
        expect(userCreated.name).to.deep.equal(userData.name);
      });
    });

    describe("deleteUser", () => {
      it("should delete the user with the specified id", async () => {
        const userToDelete = await usersBuilders.build();

        await usersServices.deleteUser(userToDelete.id);
      });
    });
  });

  describe("User Integration", () => {
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
