import assert from "node:assert/strict";
import test from "node:test";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { auth } from "../src/lib/auth";

const origin = "http://localhost:3000";
const email = "mentora@example.test";
const password = "contraseña-de-prueba";

function createTestAccount() {
  const accounts = { user: [], account: [], session: [], verification: [] };
  const authForTest = betterAuth({
    ...auth.options,
    baseURL: origin,
    secret: "a-test-secret-for-local-account-tests",
    database: memoryAdapter(accounts),
    advanced: { ...auth.options.advanced, backgroundTasks: undefined },
    logger: { disabled: true },
    rateLimit: { enabled: false },
    telemetry: { enabled: false },
  });

  function post(
    path: string,
    body: object,
    cookie?: string,
    requestHeaders: Record<string, string> = {},
  ) {
    return authForTest.handler(
      new Request(`${origin}/api/auth${path}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin,
          ...(cookie ? { cookie } : {}),
          ...requestHeaders,
        },
        body: JSON.stringify(body),
      }),
    );
  }

  async function signIn() {
    const { user } = await authForTest.api.createUser({
      body: { name: "Mentora de prueba", email, password },
    });
    const { internalAdapter } = await authForTest.$context;
    await internalAdapter.updateUser(user.id, { role: "mentor" });
    const response = await post("/sign-in/email", { email, password });
    assert.equal(response.status, 200);
    const cookie = response.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
    assert.ok(cookie);
    return cookie;
  }

  return { authForTest, post, signIn };
}

test("account updates accept the panel origin behind a proxy", async () => {
  const { authForTest, post, signIn } = createTestAccount();
  const cookie = await signIn();
  const panelOrigin = "https://panel.example.test";
  const panelHeaders = {
    origin: panelOrigin,
    host: "internal.example.test:3000",
    "x-forwarded-host": new URL(panelOrigin).host,
    "sec-fetch-site": "same-origin",
  };

  const updated = await post(
    "/update-user",
    { name: "Nombre actualizado" },
    cookie,
    panelHeaders,
  );
  assert.equal(updated.status, 200, await updated.text());
  assert.equal(
    (await authForTest.api.getSession({ headers: new Headers({ cookie }) }))
      ?.user.name,
    "Nombre actualizado",
  );

  const changed = await post(
    "/change-password",
    {
      currentPassword: password,
      newPassword: "nueva-contraseña-del-panel",
      revokeOtherSessions: true,
    },
    cookie,
    panelHeaders,
  );
  assert.equal(changed.status, 200, await changed.text());
});

test("account updates still reject cross-site requests and unknown origins", async () => {
  const { post, signIn } = createTestAccount();
  const cookie = await signIn();
  const requestHeaders = {
    origin: "https://other.example.test",
    host: "panel.example.test",
  };

  for (const headers of [
    { ...requestHeaders, "sec-fetch-site": "same-origin" },
    { ...requestHeaders, "x-forwarded-host": "other.example.test" },
    {
      ...requestHeaders,
      "x-forwarded-host": "other.example.test",
      "sec-fetch-site": "cross-site",
    },
  ]) {
    const response = await post(
      "/update-user",
      { name: "Nombre que no debe guardarse" },
      cookie,
      headers,
    );
    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, "INVALID_ORIGIN");
  }
});

test("profile fields are editable on the authenticated account", async () => {
  const { authForTest, post, signIn } = createTestAccount();
  const cookie = await signIn();
  const details = {
    name: "  María López  ",
    phone: "+503 2222 2222",
    image: "https://example.test/photo.jpg",
  };

  assert.equal((await post("/update-user", details)).status, 401);
  assert.equal(
    (await post("/update-user", { ...details, role: "admin" }, cookie)).status,
    400,
  );
  assert.equal(
    (await post("/update-user", { image: "data:image/png,example" }, cookie))
      .status,
    400,
  );
  assert.equal(
    (await post("/update-user", { phone: "texto" }, cookie)).status,
    400,
  );
  assert.equal(
    (
      await post(
        "/update-user",
        { ...details, mentorId: "another-mentor" },
        cookie,
      )
    ).status,
    200,
  );

  const headers = new Headers({ cookie });
  const session = await authForTest.api.getSession({ headers });
  assert.equal(session?.user.name, "María López");
  assert.equal(session?.user.phone, details.phone);
  assert.equal(session?.user.image, details.image);
  assert.equal(session?.user.role, "mentor");
  assert.equal(Object.hasOwn(session?.user ?? {}, "mentorId"), false);

  assert.equal(
    (await post("/update-user", { phone: "", image: null }, cookie)).status,
    200,
  );
  const cleared = await authForTest.api.getSession({ headers });
  assert.equal(cleared?.user.phone, "");
  assert.equal(cleared?.user.image, null);
  assert.equal(cleared?.user.name, "María López");
});

test("password recovery sends one Resend email and consumes the link", async (t) => {
  const { authForTest, post, signIn } = createTestAccount();
  const cookie = await signIn();
  for (const [key, value] of Object.entries({
    BETTER_AUTH_URL: origin,
    RESEND_API_KEY: "test-resend-key",
    RESEND_FROM_EMAIL: "AVNES <cuentas@example.test>",
  })) {
    const previous = process.env[key];
    process.env[key] = value;
    t.after(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
  }

  const emails: { to: string[]; text: string }[] = [];
  t.mock.method(
    globalThis,
    "fetch",
    async (url: string, options: RequestInit) => {
      assert.equal(url, "https://api.resend.com/emails");
      assert.equal(
        new Headers(options.headers).get("authorization"),
        "Bearer test-resend-key",
      );
      emails.push(JSON.parse(String(options.body)));
      return Response.json({ id: "test-email-id" });
    },
  );

  const existing = await post("/request-password-reset", {
    email,
    redirectTo: "/another-page",
  });
  const unknown = await post("/request-password-reset", {
    email: "unknown@example.test",
    redirectTo: "/reset-password",
  });
  assert.equal(existing.status, 200);
  assert.equal(unknown.status, 200);
  assert.deepEqual(await unknown.json(), await existing.json());
  assert.equal(emails.length, 1);
  assert.deepEqual(emails[0].to, [email]);

  const link = emails[0].text.split("\n\n")[1];
  const redirect = await authForTest.handler(new Request(link));
  assert.equal(redirect.status, 302);
  const target = new URL(redirect.headers.get("location") ?? "");
  assert.equal(target.origin, origin);
  assert.equal(target.pathname, "/reset-password");
  const token = target.searchParams.get("token");
  assert.ok(token);

  const newPassword = "nueva-contraseña-de-prueba";
  assert.equal(
    (await post("/reset-password", { token, newPassword })).status,
    200,
  );
  assert.equal(
    (await post("/reset-password", { token, newPassword })).status,
    400,
  );
  assert.equal(
    await authForTest.api.getSession({ headers: new Headers({ cookie }) }),
    null,
  );
  assert.equal((await post("/sign-in/email", { email, password })).status, 401);
  assert.equal(
    (await post("/sign-in/email", { email, password: newPassword })).status,
    200,
  );
});

test("changing the password checks the current password and revokes other sessions", async () => {
  const { authForTest, post, signIn } = createTestAccount();
  const otherCookie = await signIn();
  const signInResponse = await post("/sign-in/email", { email, password });
  const currentCookie = signInResponse.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  assert.ok(currentCookie);

  const newPassword = "una-nueva-contraseña";
  const options = { newPassword, revokeOtherSessions: true };
  const wrongPassword = await post(
    "/change-password",
    { ...options, currentPassword: "incorrecta" },
    currentCookie,
  );
  assert.equal(wrongPassword.status, 400);
  assert.equal((await wrongPassword.json()).code, "INVALID_PASSWORD");

  const changed = await post(
    "/change-password",
    { ...options, currentPassword: password },
    currentCookie,
  );
  assert.equal(changed.status, 200);
  const newCookie = changed.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  assert.equal(
    await authForTest.api.getSession({
      headers: new Headers({ cookie: otherCookie }),
    }),
    null,
  );
  assert.equal(
    (
      await authForTest.api.getSession({
        headers: new Headers({ cookie: newCookie }),
      })
    )?.user.email,
    email,
  );
});
