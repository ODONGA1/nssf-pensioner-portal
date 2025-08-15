// Seed data for NSSF Pensioner Portal Database
import {
  PrismaClient,
  UserRole,
  PensionStatus,
  BenefitType,
  PaymentStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🧹 Cleaning existing data...");
    await prisma.verificationRequests.deleteMany();
    await prisma.auditLogs.deleteMany();
    await prisma.notifications.deleteMany();
    await prisma.messages.deleteMany();
    await prisma.documents.deleteMany();
    await prisma.payments.deleteMany();
    await prisma.benefits.deleteMany();
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
        total_contributions: 125000000, // In cents (UGX 1,250,000)
        is_verified: true,
        is_active: true,
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
        total_contributions: 98000000, // In cents (UGX 980,000)
        is_verified: true,
        is_active: true,
      },
    });

    // Create test users
    console.log("� Creating test users...");
    const user1 = await prisma.users.create({
      data: {
        pensioner_id: pensioner1.pensioner_id,
        username: "NSS12345678",
        password_hash: hashedPassword,
        role: UserRole.PENSIONER,
        is_active: true,
      },
    });

    const user2 = await prisma.users.create({
      data: {
        pensioner_id: pensioner2.pensioner_id,
        username: "NSS87654321",
        password_hash: hashedPassword,
        role: UserRole.PENSIONER,
        is_active: true,
      },
    });

    const adminUser = await prisma.users.create({
      data: {
        username: "admin@nssf.ug",
        password_hash: hashedAdminPassword,
        role: UserRole.ADMIN,
        is_active: true,
      },
    });

    const supportUser = await prisma.users.create({
      data: {
        username: "support@nssf.ug",
        password_hash: hashedAdminPassword,
        role: UserRole.SUPPORT_STAFF,
        is_active: true,
      },
    });

    console.log("✅ Created users and pensioners");

    // Create benefits
    console.log("� Creating benefits...");
    await prisma.benefits.create({
      data: {
        pensioner_id: pensioner1.pensioner_id,
        benefit_type: BenefitType.AGE,
        monthly_benefit_amount: 2500000, // UGX 25,000 per month
        annual_benefit_amount: 30000000, // UGX 300,000 per year
        total_contributions: 125000000,
        benefit_start_date: new Date("2023-03-15"),
        is_active: true,
      },
    });

    await prisma.benefits.create({
      data: {
        pensioner_id: pensioner2.pensioner_id,
        benefit_type: BenefitType.AGE,
        monthly_benefit_amount: 1960000, // UGX 19,600 per month
        annual_benefit_amount: 23520000, // UGX 235,200 per year
        total_contributions: 98000000,
        benefit_start_date: new Date("2025-07-22"),
        is_active: false, // Not active yet
      },
    });

    // Create payment records for active pensioner
    console.log("� Creating payment records...");
    const benefit1 = await prisma.benefits.findFirst({
      where: { pensioner_id: pensioner1.pensioner_id },
    });

    if (benefit1) {
      // Create last 6 months of payments
      for (let i = 0; i < 6; i++) {
        const paymentDate = new Date();
        paymentDate.setMonth(paymentDate.getMonth() - i);

        await prisma.payments.create({
          data: {
            pensioner_id: pensioner1.pensioner_id,
            benefit_id: benefit1.benefit_id,
            payment_amount: benefit1.monthly_benefit_amount,
            payment_date: paymentDate,
            payment_status:
              i === 0 ? PaymentStatus.PENDING : PaymentStatus.PROCESSED,
            payment_method: "BANK_TRANSFER",
            transaction_reference: `TXN${Date.now()}${i}`,
          },
        });
      }
    }

    console.log("✅ Database seeding completed successfully!");

    // Display summary
    const userCount = await prisma.users.count();
    const pensionerCount = await prisma.pensioners.count();
    const benefitCount = await prisma.benefits.count();
    const paymentCount = await prisma.payments.count();

    console.log("\n📊 Seeding Summary:");
    console.log(`👥 Users: ${userCount}`);
    console.log(`🏦 Pensioners: ${pensionerCount}`);
    console.log(`💰 Benefits: ${benefitCount}`);
    console.log(`💸 Payments: ${paymentCount}`);

    console.log("\n🔑 Test Login Credentials:");
    console.log("Pensioners:");
    console.log("  NSSF: NSS12345678, Password: password123");
    console.log("  NSSF: NSS87654321, Password: password123");
    console.log("Admin:");
    console.log("  Username: admin@nssf.ug, Password: admin123");
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
