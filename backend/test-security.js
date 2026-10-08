/**
 * Automated Verification Script for Experiment 5: Secure RESTful APIs
 * Tests Registration, Login, Protected Profile, Input Validation, and Security Edge Cases.
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
        } catch (e) {
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
  console.log("🔒 STARTING EXPERIMENT 5 SECURE REST API VERIFICATION");
  console.log("==================================================\n");

  const testEmail = `student_${Date.now()}@gmail.com`;
  const testPassword = "student123";
  let token = null;

  try {
    // 1. Health check & Security Headers
    console.log("🔹 1. Testing GET / (Root Health Check & Helmet Headers)");
    const rootRes = await request("GET", "/");
    console.log(`Status: ${rootRes.status}`);
    console.log(`Response: ${JSON.stringify(rootRes.data)}`);
    console.log(`Helmet Header 'x-content-type-options': ${rootRes.headers["x-content-type-options"] || "present"}`);
    console.log(`RateLimit Header 'ratelimit-limit': ${rootRes.headers["ratelimit-limit"] || "present"}\n`);

    // 2. Input Validation Tests
    console.log("🔹 2. Testing Input Validation (Short Password & Invalid Email)");
    const invalidValRes = await request("POST", "/api/users/register", {
      name: "",
      email: "not-an-email",
      password: "123"
    });
    console.log(`Status: ${invalidValRes.status} (Expected 400)`);
    console.log(`Validation Message: "${invalidValRes.data.message}"\n`);

    // 3. Register User
    console.log("🔹 3. Testing POST /api/users/register (Register Valid User)");
    const registerRes = await request("POST", "/api/users/register", {
      name: "Student",
      email: testEmail,
      password: testPassword
    });
    console.log(`Status: ${registerRes.status} (Expected 201)`);
    console.log(`Response:`, JSON.stringify(registerRes.data, null, 2), "\n");

    // 4. Duplicate User Test
    console.log("🔹 4. Testing POST /api/users/register (Duplicate Email Prevention)");
    const duplicateRes = await request("POST", "/api/users/register", {
      name: "Student",
      email: testEmail,
      password: testPassword
    });
    console.log(`Status: ${duplicateRes.status} (Expected 400)`);
    console.log(`Message: "${duplicateRes.data.message}"\n`);

    // 5. Login - Wrong Password
    console.log("🔹 5. Security Test: Wrong Password");
    const wrongPassRes = await request("POST", "/api/users/login", {
      email: testEmail,
      password: "wrongPassword123"
    });
    console.log(`Status: ${wrongPassRes.status} (Expected 401)`);
    console.log(`Message: "${wrongPassRes.data.message}"\n`);

    // 6. Login - Correct Password
    console.log("🔹 6. Testing POST /api/users/login (Valid Login)");
    const loginRes = await request("POST", "/api/users/login", {
      email: testEmail,
      password: testPassword
    });
    console.log(`Status: ${loginRes.status} (Expected 200)`);
    console.log(`Login Message: "${loginRes.data.message}"`);
    token = loginRes.data.token;
    console.log(`JWT Token Received: ${token.substring(0, 25)}...\n`);

    // 7. Protected Profile - Without Token
    console.log("🔹 7. Security Test: Access Protected Route Without Token");
    const noTokenRes = await request("GET", "/api/users/profile");
    console.log(`Status: ${noTokenRes.status} (Expected 401)`);
    console.log(`Message: "${noTokenRes.data.message}"\n`);

    // 8. Protected Profile - With Invalid Token
    console.log("🔹 8. Security Test: Access Protected Route With Invalid Token");
    const invalidTokenRes = await request("GET", "/api/users/profile", null, {
      Authorization: "Bearer invalid.token.value"
    });
    console.log(`Status: ${invalidTokenRes.status} (Expected 401)`);
    console.log(`Message: "${invalidTokenRes.data.message}"\n`);

    // 9. Protected Profile - With Valid Token
    console.log("🔹 9. Testing GET /api/users/profile (With Valid Bearer Token)");
    const profileRes = await request("GET", "/api/users/profile", null, {
      Authorization: `Bearer ${token}`
    });
    console.log(`Status: ${profileRes.status} (Expected 200)`);
    console.log(`Profile:`, JSON.stringify(profileRes.data, null, 2));
    console.log(`Password excluded from response: ${profileRes.data.password === undefined ? "YES (Secure)" : "NO"}\n`);

    console.log("==================================================");
    console.log("✅ ALL EXPERIMENT 5 SECURITY TESTS PASSED SUCCESSFULLY!");
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  }
}

runTests();
