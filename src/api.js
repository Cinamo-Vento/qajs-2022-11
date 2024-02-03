export async function createUser(userName, password) {
  const response = await fetch("https://bookstore.demoqa.com/Account/v1/User", {
    method: "post",
    body: JSON.stringify({
      userName: userName,
      password: password,
    }),
    headers: { accept: "application/json", "Content-Type": "application/json" },
  });
  return response;
}

export async function generateToken(userName, password) {
  const response = await fetch(
    "https://bookstore.demoqa.com/Account/v1/GenerateToken",
    {
      method: "post",
      body: JSON.stringify({
        userName: userName,
        password: password,
      }),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  return response;
}
