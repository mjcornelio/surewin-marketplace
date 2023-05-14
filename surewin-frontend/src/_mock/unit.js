import { faker } from "@faker-js/faker";

// ----------------------------------------------------------------------

const units = [...Array(28)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  manager: faker.name.findName(),
  type: "stall",
  address: faker.address.buildingNumber(),
  status: "Vacant",
  rent: faker.commerce.price(),
}));

export default units;
