import axios from "axios";
import { AppError } from "../error";
import STATUS from "../constants/status";
import * as https from "https";

class GeoLib {
  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number },
  ): Promise<string> {
    try {
      const lat =
        coordinates instanceof Array ? coordinates[0] : coordinates.lat;
      const lon =
        coordinates instanceof Array ? coordinates[1] : coordinates.lng;

      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: lat,
            lon: lon,
            format: "json",
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        },
      );

      if (!data.display_name) {
        throw new AppError(
          "Endereço não encontrado com base nas coordenadas.",
          "ADDRESS_NOT_FOUND",
          STATUS.NOT_FOUND,
        );
      }

      return data.display_name;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError(
        "Erro desconhecido ao conectar com o serviço de geocodificação, tente novamente mais tarde.",
        "GEO_SERVICE_ERROR",
        STATUS.INTERNAL_SERVER_ERROR,
        { error: err },
      );
    }
  }

  public async getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: address,
            format: "json",
          },
        },
      );

      const location = data[0];

      if (!location) {
        throw new AppError(
          "Coordenadas não encontradas com base no endereço.",
          "COORDINATES_NOT_FOUND",
          STATUS.NOT_FOUND,
        );
      }

      return {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
      };
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError(
        "Erro desconhecido ao conectar com o serviço de geocodificação, tente novamente mais tarde.",
        "GEO_SERVICE_ERROR",
        STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export default new GeoLib();
