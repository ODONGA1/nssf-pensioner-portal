// Simple seed data for NSSF Pensioner Portal Database
import { PrismaClient, UserRole, PensionStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("🌱 Starting simple database seeding...");

  try {
    // Clear existing data
    console.log("🧹 Cleaning existing data...");
    await prisma.users.deleteMany();
    await prisma.pensioners.deleteMany();

    // Hash passwords
    const hashedPassword = await bcrypt.hash("password123", 12);
    const hashedAdminPassword = await bcrypt.hash("admin123", 12);

    // Create pensioners first
    console.log("🏦 Creating pensioners...");
    const pensioner1 = await prisma.pensioners.create({
      data: {
        nssf_number: "NSS12345678",
        national_id_number: "CF12345678901234",
        first_name: "John",
        middle_name: "Paul",
        last_name: "Mukasa",
        date_of_birth: new Date("1958-03-15"),
        gender: "M",
        phone_number: "+256701234567",
        email_address: "john.mukasa@example.com",
        postal_address: "P.O. Box 12345, Kampala",
        physical_address: "Nakawa Division, Kampala",
        district: "Kampala",
        region: "Central",
        last_employer: "Ministry of Education",
        employment_start_date: new Date("1988-03-15"),
        employment_end_date: new Date("2023-03-15"),
        total_service_years: 35,
        bank_name: "Centenary Bank",
        bank_account_number: "1234567890",
        bank_branch: "Kampala Main",
        pension_status: PensionStatus.ACTIVE,
        registration_date: new Date("2023-01-15"),
        is_verified: true,
      },
    });

    const pensioner2 = await prisma.pensioners.create({
      data: {
        nssf_number: "NSS87654321",
        national_id_number: "CF98765432109876",
        first_name: "Mary",
        middle_name: "Jane",
        last_name: "Nakato",
        date_of_birth: new Date("1960-07-22"),
        gender: "F",
        phone_number: "+256702345678",
        email_address: "mary.nakato@example.com",
        postal_address: "P.O. Box 54321, Entebbe",
        physical_address: "Entebbe Municipality",
        district: "Wakiso",
        region: "Central",
        last_employer: "Kampala City Council",
        employment_start_date: new Date("1995-07-22"),
        employment_end_date: new Date("2025-07-22"),
        total_service_years: 30,
        bank_name: "Stanbic Bank",
        bank_account_number: "0987654321",
        bank_branch: "Entebbe",
        pension_status: PensionStatus.PENDING,
        registration_date: new Date("2024-07-15"),
        is_verified: true,
      },
    });

    // Create test users
    console.log("👥 Creating test users...");
    await prisma.users.create({
      data: {
        pensioner_id: pensioner1.pensioner_id,
        username: "NSS12345678",
        password_hash: hashedPassword,
        role: UserRole.PENSIONER,
        is_active: true,
      },
    });

    await prisma.users.create({
      data: {
        pensioner_id: pensioner2.pensioner_id,
        username: "NSS87654321",
        password_hash: hashedPassword,
        role: UserRole.PENSIONER,
        is_active: true,
      },
    });

    await prisma.users.create({
      data: {
        username: "admin@nssf.ug",
        password_hash: hashedAdminPassword,
        role: UserRole.ADMIN,
        is_active: true,
      },
    });

    console.log("✅ Database seeding completed successfully!");

    // Display summary
    const userCount = await prisma.users.count();
    const pensionerCount = await prisma.pensioners.count();

    console.log("\n📊 Seeding Summary:");
    console.log(`👥 Users: ${userCount}`);
    console.log(`🏦 Pensioners: ${pensionerCount}`);

    console.log("\n🔑 Test Login Credentials:");
    console.log("Pensioners:");
    console.log("  NSSF: NSS12345678, Password: password123");
    console.log("  NSSF: NSS87654321, Password: password123");
    console.log("Admin:");
    console.log("  Username: admin@nssf.ug, Password: admin123");

    console.log("\n🔗 Test NSSF Numbers for Forgot Password:");
    console.log("  NSS12345678 (John Mukasa - Active)");
    console.log("  NSS87654321 (Mary Nakato - Pending)");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log("🎉 Database seeding process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });
