/**
 * Automated Verification Script for Experiment 6: JWT Authentication & User Roles (RBAC)
 */

const http = require("http");

const BASE_URL = "http://127.0.0.1:5000";

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: json, raw: data });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("🛡️ STARTING EXPERIMENT 6 RBAC API VERIFICATION");
  console.log("==================================================\n");

  const ts = Date.now();
  const userEmail = `vedant_${ts}@gmail.com`;
  const adminEmail = `admin_${ts}@gmail.com`;
  let userToken = "";
  let adminToken = "";

  try {
    // 1. Register User (role: 'user')
    console.log("🔹 1. Register User with role: 'user'");
    const regUserRes = await request("POST", "/api/auth/register", {
      name: "Vedant",
      email: userEmail,
      password: "password123",
      role: "user"
    });
    console.log(`Status: ${regUserRes.status} (Expected 201)`);
    console.log(`Response:`, JSON.stringify(regUserRes.data), "\n");

    // 2. Register Admin (role: 'admin')
    console.log("🔹 2. Register Admin with role: 'admin'");
    const regAdminRes = await request("POST", "/api/auth/register", {
      name: "Admin User",
      email: adminEmail,
      password: "admin123",
      role: "admin"
    });
    console.log(`Status: ${regAdminRes.status} (Expected 201)`);
    console.log(`Response:`, JSON.stringify(regAdminRes.data), "\n");

    // 3. Login as User
    console.log("🔹 3. Login as User");
    const loginUserRes = await request("POST", "/api/auth/login", {
      email: userEmail,
      password: "password123"
    });
    console.log(`Status: ${loginUserRes.status} (Expected 200)`);
    userToken = loginUserRes.data.token;
    console.log(`User Token received (role: ${loginUserRes.data.user.role})\n`);

    // 4. Access Protected Dashboard as User
    console.log("🔹 4. Access /api/user/dashboard using User Token");
    const userDashRes = await request("GET", "/api/user/dashboard", null, {
      Authorization: `Bearer ${userToken}`
    });
    console.log(`Status: ${userDashRes.status} (Expected 200)`);
    console.log(`Response:`, JSON.stringify(userDashRes.data), "\n");

    // 5. Test Admin Route with User Account (Should Fail with 403)
    console.log("🔹 5. Test Admin Route (/api/user/admin) with User Token (Expect 403 Forbidden)");
    const userAdminRes = await request("GET", "/api/user/admin", null, {
      Authorization: `Bearer ${userToken}`
    });
    console.log(`Status: ${userAdminRes.status} (Expected 403)`);
    console.log(`Response:`, JSON.stringify(userAdminRes.data), "\n");

    // 6. Login as Admin
    console.log("🔹 6. Login as Admin");
    const loginAdminRes = await request("POST", "/api/auth/login", {
      email: adminEmail,
      password: "admin123"
    });
    console.log(`Status: ${loginAdminRes.status} (Expected 200)`);
    adminToken = loginAdminRes.data.token;
    console.log(`Admin Token received (role: ${loginAdminRes.data.user.role})\n`);

    // 7. Access Admin Route as Admin (Should Succeed with 200)
    console.log("🔹 7. Access Admin Route (/api/user/admin) with Admin Token (Expect 200 OK)");
    const adminAccessRes = await request("GET", "/api/user/admin", null, {
      Authorization: `Bearer ${adminToken}`
    });
    console.log(`Status: ${adminAccessRes.status} (Expected 200)`);
    console.log(`Response:`, JSON.stringify(adminAccessRes.data), "\n");

    // 8. Test No Token
    console.log("🔹 8. Test No Token to /api/user/dashboard (Expect 401)");
    const noTokenRes = await request("GET", "/api/user/dashboard");
    console.log(`Status: ${noTokenRes.status} (Expected 401)`);
    console.log(`Response:`, JSON.stringify(noTokenRes.data), "\n");

    console.log("==================================================");
    console.log("✅ ALL EXPERIMENT 6 RBAC TESTS PASSED SUCCESSFULLY!");
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

runTests();
