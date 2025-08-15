import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("Checking users for authentication...\n");

    // Get all users with their pensioner details
    const users = (await prisma.$queryRaw`
      SELECT 
        u.user_id,
        u.username,
        u.role,
        u.is_active,
        u.password_hash,
        p.pensioner_id,
        p.nssf_number,
        p.first_name,
        p.last_name,
        p.email_address,
        p.phone_number
      FROM users u
      LEFT JOIN pensioners p ON u.pensioner_id = p.pensioner_id
      ORDER BY u.username
    `) as Array<{
      user_id: string;
      username: string;
      role: string;
      is_active: boolean;
      password_hash: string;
      pensioner_id: string | null;
      nssf_number: string | null;
      first_name: string | null;
      last_name: string | null;
      email_address: string | null;
      phone_number: string | null;
    }>;

    console.log(`Found ${users.length} users:\n`);

    users.forEach((user) => {
      console.log(`👤 Username: ${user.username}`);
      console.log(`   Email: ${user.email_address || "Not set"}`);
      console.log(`   Phone: ${user.phone_number || "Not set"}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.is_active}`);
      console.log(
        `   Password Hash: ${user.password_hash ? "Set" : "Not Set"}`
      );

      if (user.pensioner_id) {
        console.log(`   NSSF Number: ${user.nssf_number}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);
      }
      console.log("");
    });

    // Check pensioners without user accounts
    const pensionersWithoutUsers = (await prisma.$queryRaw`
      SELECT p.pensioner_id, p.nssf_number, p.first_name, p.last_name
      FROM pensioners p
      LEFT JOIN users u ON p.pensioner_id = u.pensioner_id
      WHERE u.user_id IS NULL
    `) as Array<{
      pensioner_id: string;
      nssf_number: string;
      first_name: string;
      last_name: string;
    }>;

    if (pensionersWithoutUsers.length > 0) {
      console.log(`\n⚠️ Pensioners without user accounts:`);
      pensionersWithoutUsers.forEach((pensioner) => {
        console.log(
          `   ${pensioner.nssf_number}: ${pensioner.first_name} ${pensioner.last_name}`
        );
      });
    }
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
