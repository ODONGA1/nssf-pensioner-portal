import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("Checking database state...\n");

    // Check basic tables
    const pensionersCount =
      (await prisma.$queryRaw`SELECT COUNT(*) FROM pensioners`) as Array<{
        count: string;
      }>;
    const usersCount =
      (await prisma.$queryRaw`SELECT COUNT(*) FROM users`) as Array<{
        count: string;
      }>;

    console.log(`Pensioners: ${pensionersCount[0].count}`);
    console.log(`Users: ${usersCount[0].count}`);

    // Check new tables
    try {
      const savingsAccountsCount =
        (await prisma.$queryRaw`SELECT COUNT(*) FROM voluntary_savings_accounts`) as Array<{
          count: string;
        }>;
      const transactionsCount =
        (await prisma.$queryRaw`SELECT COUNT(*) FROM savings_transactions`) as Array<{
          count: string;
        }>;
      const applicationsCount =
        (await prisma.$queryRaw`SELECT COUNT(*) FROM midterm_access_applications`) as Array<{
          count: string;
        }>;
      const workflowCount =
        (await prisma.$queryRaw`SELECT COUNT(*) FROM midterm_approval_workflow`) as Array<{
          count: string;
        }>;
      const documentsCount =
        (await prisma.$queryRaw`SELECT COUNT(*) FROM midterm_supporting_documents`) as Array<{
          count: string;
        }>;

      console.log("\n--- New Module Tables ---");
      console.log(
        `Voluntary Savings Accounts: ${savingsAccountsCount[0].count}`
      );
      console.log(`Savings Transactions: ${transactionsCount[0].count}`);
      console.log(`Midterm Access Applications: ${applicationsCount[0].count}`);
      console.log(`Approval Workflow Steps: ${workflowCount[0].count}`);
      console.log(`Supporting Documents: ${documentsCount[0].count}`);

      // Show sample data
      if (parseInt(savingsAccountsCount[0].count) > 0) {
        const sampleAccounts = (await prisma.$queryRaw`
          SELECT account_number, account_name, current_balance, account_status 
          FROM voluntary_savings_accounts 
          LIMIT 3
        `) as Array<{
          account_number: string;
          account_name: string;
          current_balance: string;
          account_status: string;
        }>;

        console.log("\n--- Sample Voluntary Savings Accounts ---");
        sampleAccounts.forEach((account) => {
          console.log(
            `${account.account_number}: ${account.account_name} - UGX ${Number(
              account.current_balance
            ).toLocaleString()} (${account.account_status})`
          );
        });
      }

      if (parseInt(applicationsCount[0].count) > 0) {
        const sampleApplications = (await prisma.$queryRaw`
          SELECT application_number, access_reason, requested_amount, application_status 
          FROM midterm_access_applications 
          LIMIT 3
        `) as Array<{
          application_number: string;
          access_reason: string;
          requested_amount: string;
          application_status: string;
        }>;

        console.log("\n--- Sample Midterm Access Applications ---");
        sampleApplications.forEach((app) => {
          console.log(
            `${app.application_number}: ${app.access_reason} - UGX ${Number(
              app.requested_amount
            ).toLocaleString()} (${app.application_status})`
          );
        });
      }
    } catch (error) {
      console.log("\n--- New tables not found ---");
      console.log(
        "The Voluntary Savings and Midterm Access tables do not exist yet."
      );
    }
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
