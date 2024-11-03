import { faker } from "@faker-js/faker";

const generateCoordinate = () => [
  faker.location.longitude({ min: -180, max: 180 }),
  faker.location.latitude({ min: -90, max: 90 }),
];

export default generateCoordinate;
