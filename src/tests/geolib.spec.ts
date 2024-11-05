import { expect } from "chai";
import axios from "axios";
import GeoLib from "../libs/geolib";
import * as sinon from "sinon";
import generateCoordinate from "./builders/coordinates";

describe("GeoLib", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getAddressFromCoordinates", () => {
    it("should return the address when valid coordinates are provided", async () => {
      const coordinates = generateCoordinate() as [number, number];
      const mockResponse = {
        data: { display_name: "Rua dos bobos 0" },
      };
      sinon.stub(axios, "get").resolves(mockResponse);

      const address = await GeoLib.getAddressFromCoordinates(coordinates);

      expect(address).to.equal("Rua dos bobos 0");
    });
  });

  describe("getCoordinatesFromAddress", () => {
    it("should return coordinates when a valid address is provided", async () => {
      const mockResponse = {
        data: [{ lat: "40.7128", lon: "-74.006" }],
      };
      sinon.stub(axios, "get").resolves(mockResponse);

      const coordinates =
        await GeoLib.getCoordinatesFromAddress("Rua dos Bobos 0");

      expect(coordinates).to.deep.equal({ lat: 40.7128, lng: -74.006 });
    });
  });
});
