// Database Connectivity Test for NSSF Pensioner Portal
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabaseConnectivity() {
  console.log("🔗 Testing database connectivity...");

  try {
    // Test basic connection
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test a simple query
    const result =
      (await prisma.$queryRaw`SELECT version() as postgres_version, current_database() as database_name, current_user as user_name`) as any[];
    console.log("📊 Database info:", result[0]);

    // Test if we can query the users table
    const userCount = await prisma.users.count();
    console.log(`👥 Users table accessible - Current count: ${userCount}`);

    // Test if we can query the pensioners table
    const pensionerCount = await prisma.pensioners.count();
    console.log(
      `🏦 Pensioners table accessible - Current count: ${pensionerCount}`
    );

    console.log("✅ All database tests passed!");
  } catch (error) {
    console.error("❌ Database connectivity test failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run the test
testDatabaseConnectivity()
  .then(() => {
    console.log("🎉 Database connectivity test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test execution failed:", error);
    process.exit(1);
  });
