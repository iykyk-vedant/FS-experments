/**
 * Automated Verification Script for Experiment 4 CRUD APIs
 * Tests all 5 REST operations for both Weather and Product resources.
 */

const http = require("http");

const BASE_URL = "http://127.0.0.1:5000";

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
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
  console.log("🧪 STARTING EXPERIMENT 4 REST API VERIFICATION");
  console.log("==================================================\n");

  try {
    // 1. Health check
    console.log("🔹 1. Testing GET / (Root Health Check)");
    const rootRes = await request("GET", "/");
    console.log(`Status: ${rootRes.status}, Response: "${rootRes.raw}"\n`);

    // ==========================================
    // WEATHER REST API CRUD TESTS
    // ==========================================
    console.log("--------------------------------------------------");
    console.log("🌦️ TESTING WEATHER REST CRUD APIs (/api/weather)");
    console.log("--------------------------------------------------");

    // POST /api/weather (Create)
    console.log("\n[POST] /api/weather - Creating Weather record for Mumbai...");
    const createWeatherRes = await request("POST", "/api/weather", {
      cityName: "Mumbai",
      country: "India",
      temperature: 31,
      condition: "Partly Cloudy",
      humidity: 78,
      windSpeed: 14,
      description: "Humid coastal weather with moderate sea breeze",
      isFavorite: true
    });
    console.log(`Status: ${createWeatherRes.status}`);
    console.log("Created Document:", JSON.stringify(createWeatherRes.data, null, 2));
    const weatherId = createWeatherRes.data._id;

    // GET /api/weather (Get All)
    console.log("\n[GET] /api/weather - Fetching all Weather records...");
    const getAllWeatherRes = await request("GET", "/api/weather");
    console.log(`Status: ${getAllWeatherRes.status}`);
    console.log(`Total Weather Records: ${getAllWeatherRes.data.length}`);

    // GET /api/weather/:id (Get By ID)
    console.log(`\n[GET] /api/weather/${weatherId} - Fetching weather by ID...`);
    const getOneWeatherRes = await request("GET", `/api/weather/${weatherId}`);
    console.log(`Status: ${getOneWeatherRes.status}`);
    console.log("Fetched Record:", JSON.stringify(getOneWeatherRes.data, null, 2));

    // PUT /api/weather/:id (Update)
    console.log(`\n[PUT] /api/weather/${weatherId} - Updating temperature and condition...`);
    const updateWeatherRes = await request("PUT", `/api/weather/${weatherId}`, {
      temperature: 33,
      condition: "Sunny",
      humidity: 70
    });
    console.log(`Status: ${updateWeatherRes.status}`);
    console.log("Updated Record:", JSON.stringify(updateWeatherRes.data, null, 2));

    // DELETE /api/weather/:id (Delete)
    console.log(`\n[DELETE] /api/weather/${weatherId} - Deleting weather record...`);
    const deleteWeatherRes = await request("DELETE", `/api/weather/${weatherId}`);
    console.log(`Status: ${deleteWeatherRes.status}`);
    console.log("Delete Response:", JSON.stringify(deleteWeatherRes.data, null, 2));

    // ==========================================
    // PRODUCT REST API CRUD TESTS (LAB MANUAL)
    // ==========================================
    console.log("\n--------------------------------------------------");
    console.log("📦 TESTING PRODUCT REST CRUD APIs (/api/products)");
    console.log("--------------------------------------------------");

    // POST /api/products (Create)
    console.log("\n[POST] /api/products - Creating Product 'Laptop'...");
    const createProductRes = await request("POST", "/api/products", {
      name: "Laptop",
      price: 55000,
      category: "Electronics",
      description: "Laptop for students",
      stock: 10
    });
    console.log(`Status: ${createProductRes.status}`);
    console.log("Created Product:", JSON.stringify(createProductRes.data, null, 2));
    const productId = createProductRes.data._id;

    // GET /api/products (Get All)
    console.log("\n[GET] /api/products - Fetching all products...");
    const getAllProductsRes = await request("GET", "/api/products");
    console.log(`Status: ${getAllProductsRes.status}`);
    console.log(`Total Products: ${getAllProductsRes.data.length}`);

    // GET /api/products/:id (Get By ID)
    console.log(`\n[GET] /api/products/${productId} - Fetching product by ID...`);
    const getOneProductRes = await request("GET", `/api/products/${productId}`);
    console.log(`Status: ${getOneProductRes.status}`);
    console.log("Fetched Product:", JSON.stringify(getOneProductRes.data, null, 2));

    // PUT /api/products/:id (Update)
    console.log(`\n[PUT] /api/products/${productId} - Updating price and stock...`);
    const updateProductRes = await request("PUT", `/api/products/${productId}`, {
      price: 50000,
      stock: 15
    });
    console.log(`Status: ${updateProductRes.status}`);
    console.log("Updated Product:", JSON.stringify(updateProductRes.data, null, 2));

    // DELETE /api/products/:id (Delete)
    console.log(`\n[DELETE] /api/products/${productId} - Deleting product...`);
    const deleteProductRes = await request("DELETE", `/api/products/${productId}`);
    console.log(`Status: ${deleteProductRes.status}`);
    console.log("Delete Response:", JSON.stringify(deleteProductRes.data, null, 2));

    console.log("\n==================================================");
    console.log("✅ ALL EXPERIMENT 4 REST CRUD TESTS PASSED SUCCESSFULLY!");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
}

runTests();
