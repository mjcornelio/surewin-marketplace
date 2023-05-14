import { faker } from "@faker-js/faker";

// ----------------------------------------------------------------------

const users = [...Array(28)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.findName(),
  unit: faker.address.buildingNumber(),
  mobile: faker.phone.number(),
  email: faker.internet.email(),
  deposit: faker.commerce.price(),
  balance: faker.commerce.price(),
}));

export default users;
