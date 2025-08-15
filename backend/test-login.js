const axios = require("axios");

async function testLogin() {
  try {
    console.log("Testing login API...");

    const response = await axios.post(
      "http://localhost:3004/api/v1/auth/login",
      {
        username: "NSS12345678",
        password: "password123",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Login successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Login failed!");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error:", error.message);
    }
  }
}

testLogin();
