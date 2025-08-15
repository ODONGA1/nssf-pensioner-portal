import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedVoluntarySavingsData() {
  console.log("Starting to seed Voluntary Savings and Mid-term Access data...");

  try {
    // Get existing pensioners
    const pensioners = await prisma.pensioners.findMany({
      select: {
        pensioner_id: true,
        first_name: true,
        last_name: true,
        nssf_number: true,
      },
    });

    if (pensioners.length === 0) {
      console.log(
        "No pensioners found. Please run the main seeding script first."
      );
      return;
    }

    console.log(`Found ${pensioners.length} pensioners`);

    // Create Voluntary Savings Accounts
    const savingsAccounts = [];

    for (let i = 0; i < pensioners.length; i++) {
      const pensioner = pensioners[i];
      const accountNumber = `VS${pensioner.nssf_number.slice(-6)}${String(
        i + 1
      ).padStart(2, "0")}`;

      const savingsAccount = await prisma.voluntarySavingsAccounts.create({
        data: {
          pensioner_id: pensioner.pensioner_id,
          account_number: accountNumber,
          account_name: `${pensioner.first_name} ${pensioner.last_name} - Voluntary Savings`,
          current_balance: 2500000, // UGX 25,000
          available_balance: 2500000,
          minimum_balance: 50000, // UGX 500
          interest_rate: 0.08, // 8% annual
          last_interest_date: new Date("2024-01-01"),
          total_interest_earned: 125000, // UGX 1,250
          account_status: "ACTIVE",
          opening_date: new Date("2023-06-15"),
          auto_save_amount: 100000, // UGX 1,000 monthly
          auto_save_frequency: "MONTHLY",
          next_auto_save_date: new Date("2025-02-01"),
          daily_withdrawal_limit: 5000000, // UGX 50,000
          monthly_deposit_limit: 50000000, // UGX 500,000
          created_by: null, // System created
        },
      });

      savingsAccounts.push(savingsAccount);
      console.log(
        `Created voluntary savings account for ${pensioner.first_name} ${pensioner.last_name}`
      );
    }

    // Create some sample transactions for each account
    let transactionCounter = 1;

    for (const account of savingsAccounts) {
      // Create deposit transactions
      for (let i = 0; i < 3; i++) {
        const transactionAmount = 500000 + i * 250000; // UGX 5,000, 7,500, 10,000
        const transactionDate = new Date();
        transactionDate.setMonth(transactionDate.getMonth() - (3 - i));

        await prisma.savingsTransactions.create({
          data: {
            savings_account_id: account.savings_account_id,
            transaction_type: "DEPOSIT",
            transaction_amount: transactionAmount,
            transaction_fee: 5000, // UGX 50 fee
            net_amount: transactionAmount - 5000,
            balance_before: Number(account.current_balance) - transactionAmount,
            balance_after: Number(account.current_balance),
            description: `Monthly voluntary savings deposit #${i + 1}`,
            reference_number: `TXN${String(transactionCounter).padStart(
              8,
              "0"
            )}`,
            external_reference: `BANK_REF_${String(transactionCounter).padStart(
              6,
              "0"
            )}`,
            transaction_status: "COMPLETED",
            transaction_date: transactionDate,
            value_date: transactionDate,
            processed_date: transactionDate,
            payment_method: "BANK_TRANSFER",
            bank_reference: `BNK_${String(transactionCounter).padStart(
              8,
              "0"
            )}`,
            processed_by: null,
          },
        });

        transactionCounter++;
      }

      // Create interest credit
      await prisma.savingsTransactions.create({
        data: {
          savings_account_id: account.savings_account_id,
          transaction_type: "INTEREST_CREDIT",
          transaction_amount: 125000, // UGX 1,250 interest
          transaction_fee: 0,
          net_amount: 125000,
          balance_before: Number(account.current_balance) - 125000,
          balance_after: Number(account.current_balance),
          description: "Quarterly interest payment",
          reference_number: `INT${String(transactionCounter).padStart(8, "0")}`,
          transaction_status: "COMPLETED",
          transaction_date: new Date("2024-12-31"),
          value_date: new Date("2024-12-31"),
          processed_date: new Date("2024-12-31"),
          payment_method: "SYSTEM_CREDIT",
          processed_by: null,
        },
      });

      transactionCounter++;
    }

    console.log(
      `Created transactions for ${savingsAccounts.length} savings accounts`
    );

    // Create Mid-term Access Applications
    if (savingsAccounts.length > 0) {
      const firstAccount = savingsAccounts[0];
      const firstPensioner = pensioners[0];

      // Create a sample mid-term access application
      const midtermApplication = await prisma.midtermAccessApplications.create({
        data: {
          pensioner_id: firstPensioner.pensioner_id,
          savings_account_id: firstAccount.savings_account_id,
          application_number: `MTA${new Date().getFullYear()}001`,
          access_reason: "EDUCATION",
          other_reason_details:
            "University fees for child pursuing Engineering degree",
          requested_amount: 15000000, // UGX 150,000
          total_contributions: 25000000, // UGX 250,000
          eligible_amount: 20000000, // UGX 200,000 (80% of contributions)
          max_allowable_amount: 20000000,
          percentage_requested: 75.0, // 75% of eligible amount
          application_status: "UNDER_REVIEW",
          current_approval_level: "SUPERVISOR_REVIEW",
          justification:
            "My daughter has been admitted to Makerere University for a Bachelor of Engineering degree. I need to access part of my voluntary savings to pay for her tuition fees for the first semester.",
          supporting_documents: [
            "/documents/university_admission_letter.pdf",
            "/documents/fee_structure.pdf",
            "/documents/student_id_copy.pdf",
          ],
          emergency_contact: "Sarah Mukasa (Daughter)",
          emergency_phone: "+256701234567",
          submission_date: new Date(),
          review_start_date: new Date(),
          processing_notes:
            "Application received and initial documentation review completed.",
          repayment_required: false,
          submitted_by: null,
        },
      });

      console.log(
        `Created mid-term access application: ${midtermApplication.application_number}`
      );

      // Create approval workflow steps
      const approvalLevels = [
        "INITIAL_REVIEW",
        "SUPERVISOR_REVIEW",
        "MANAGER_APPROVAL",
      ];

      for (let i = 0; i < approvalLevels.length; i++) {
        const level = approvalLevels[i];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (i + 1) * 3); // 3, 6, 9 days from now

        await prisma.midtermApprovalWorkflow.create({
          data: {
            application_id: midtermApplication.application_id,
            approval_level: level as any,
            approver_role:
              i === 0
                ? "SUPPORT_STAFF"
                : i === 1
                ? "SUPPORT_STAFF"
                : "FINANCE_OFFICER",
            status: i === 0 ? "COMPLETED" : i === 1 ? "PENDING" : "PENDING",
            assigned_date: new Date(),
            completed_date: i === 0 ? new Date() : null,
            due_date: dueDate,
            decision: i === 0 ? "APPROVED" : null,
            comments:
              i === 0
                ? "Documentation is complete and meets requirements. Forwarding to supervisor for review."
                : null,
          },
        });
      }

      console.log(
        `Created approval workflow with ${approvalLevels.length} steps`
      );

      // Create supporting documents
      const documentTypes = [
        "University Admission Letter",
        "Fee Structure",
        "Student ID Copy",
        "Birth Certificate",
      ];

      for (let i = 0; i < documentTypes.length; i++) {
        const docType = documentTypes[i];
        await prisma.midtermSupportingDocuments.create({
          data: {
            application_id: midtermApplication.application_id,
            document_type: docType,
            document_name: `${docType.replace(/\s+/g, "_").toLowerCase()}.pdf`,
            file_path: `/uploads/midterm/${
              midtermApplication.application_number
            }/${docType.replace(/\s+/g, "_").toLowerCase()}.pdf`,
            file_size: 245760 + i * 51200, // Varying file sizes
            mime_type: "application/pdf",
            verification_status: i < 3 ? "VERIFIED" : "UNDER_REVIEW",
            verified_by: i < 3 ? null : null, // Would be actual user IDs
            verification_date: i < 3 ? new Date() : null,
            verification_notes:
              i < 3 ? "Document verified and authentic" : null,
            is_required: i < 3,
            is_original_required: i === 0, // Only admission letter requires original
            uploaded_at: new Date(),
            uploaded_by: null,
          },
        });
      }

      console.log(`Created ${documentTypes.length} supporting documents`);
    }

    // Create a second application for demonstration
    if (pensioners.length > 1 && savingsAccounts.length > 1) {
      const secondAccount = savingsAccounts[1];
      const secondPensioner = pensioners[1];

      const secondApplication = await prisma.midtermAccessApplications.create({
        data: {
          pensioner_id: secondPensioner.pensioner_id,
          savings_account_id: secondAccount.savings_account_id,
          application_number: `MTA${new Date().getFullYear()}002`,
          access_reason: "MEDICAL_EMERGENCY",
          requested_amount: 8000000, // UGX 80,000
          total_contributions: 25000000,
          eligible_amount: 20000000,
          max_allowable_amount: 20000000,
          percentage_requested: 40.0,
          application_status: "APPROVED",
          current_approval_level: "FINAL_APPROVAL",
          justification:
            "Emergency medical treatment required for spouse. Hospital admission and surgery costs.",
          supporting_documents: [
            "/documents/medical_report.pdf",
            "/documents/hospital_bill.pdf",
          ],
          emergency_contact: "Dr. Peter Ssali",
          emergency_phone: "+256702345678",
          submission_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          review_start_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          approval_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          approved_amount: 8000000,
          processing_notes: "Urgent medical case - expedited approval granted.",
          disbursement_method: "BANK_TRANSFER",
          disbursement_reference: "DISB_MED_001",
          repayment_required: true,
          repayment_amount: 8000000,
          repayment_period: 12, // 12 months
          monthly_deduction: 666667, // UGX ~6,667 per month
          submitted_by: null,
        },
      });

      console.log(
        `Created second mid-term access application: ${secondApplication.application_number}`
      );
    }

    console.log(
      "\n✅ Voluntary Savings and Mid-term Access data seeded successfully!"
    );
    console.log("\nCreated:");
    console.log(`- ${savingsAccounts.length} Voluntary Savings Accounts`);
    console.log(`- ${savingsAccounts.length * 4} Sample Transactions`);
    console.log("- 2 Mid-term Access Applications");
    console.log("- Approval Workflows");
    console.log("- Supporting Documents");
  } catch (error) {
    console.error("Error seeding voluntary savings data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedVoluntarySavingsData().catch((error) => {
  console.error("Failed to seed voluntary savings data:", error);
  process.exit(1);
});
