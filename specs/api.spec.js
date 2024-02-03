// eslint-disable-next-line no-unused-vars
import { createUser, generateToken } from "../src/api.js";
import { faker } from "@faker-js/faker";

describe("BookStore API test", () => {
  const userName = faker.internet.userName();
  const notExistUser = faker.internet.userName();
  const password = "paSS123!";
  const invalidPassword = "pass";
  const errPassword = "wrongPa33";

  beforeAll(async () => {
    await createUser(userName, password);
  });

  it("Создание пользователя c ошибкой, логин уже используется", async () => {
    const response = await createUser(userName, password);
    const data = await response.json();

    expect(response.status).toBe(406);
    expect(data.code).toBe("1204");
    expect(data.message).toBe("User exists!");
  });

  it("Создание пользователя c ошибкой, пароль не подходит", async () => {
    const response = await createUser(userName, invalidPassword);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.code).toBe("1300");
    expect(data.message).toBe(
      "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.",
    );
  });

  it("Создание пользователя успешно", async () => {
    const newUserName = faker.internet.userName();

    const response = await createUser(newUserName, password);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.userID).toBeTruthy;
    expect(data.userID).toHaveLength(36);
    expect(data.username).toBe(newUserName);
    expect(data).toHaveProperty("books", []);
  });

  it("Генерация токена c ошибкой, пароль не передан", async () => {
    const response = await generateToken(userName, "");
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.code).toBe("1200");
    expect(data.message).toBe("UserName and Password required.");
  });

  it.each([
    { test: "Неверный пароль", userName: userName, password: errPassword },
    {
      test: "Несуществующий пользователь",
      userName: notExistUser,
      password: password,
    },
  ])(`Генерация токена c ошибкой, $test`, async ({ userName, password }) => {
    const response = await generateToken(userName, password);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBe(null);
    expect(data.expires).toBe(null);
    expect(data.status).toBe("Failed");
    expect(data.result).toBe("User authorization failed.");
  });

  it("Генерация токена успешно", async () => {
    const response = await generateToken(userName, password);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBeTruthy;
    expect(data.expires).toBeTruthy;
    expect(data.status).toBe("Success");
    expect(data.result).toBe("User authorized successfully.");
  });
});
