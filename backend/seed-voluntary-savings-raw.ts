import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedVoluntarySavingsRaw() {
  console.log(
    "Starting to seed Voluntary Savings and Mid-term Access data using raw SQL..."
  );

  try {
    // Get existing pensioners
    const pensioners = (await prisma.$queryRaw`
      SELECT pensioner_id, first_name, last_name, nssf_number 
      FROM pensioners 
      LIMIT 2
    `) as Array<{
      pensioner_id: string;
      first_name: string;
      last_name: string;
      nssf_number: string;
    }>;

    if (pensioners.length === 0) {
      console.log(
        "No pensioners found. Please run the main seeding script first."
      );
      return;
    }

    console.log(`Found ${pensioners.length} pensioners`);

    // Create Voluntary Savings Accounts
    for (let i = 0; i < pensioners.length; i++) {
      const pensioner = pensioners[i];
      const accountNumber = `VS${pensioner.nssf_number.slice(-6)}${String(
        i + 1
      ).padStart(2, "0")}`;
      const savingsAccountId = crypto.randomUUID();

      // Insert Voluntary Savings Account
      await prisma.$executeRaw`
        INSERT INTO voluntary_savings_accounts (
          savings_account_id, pensioner_id, account_number, account_name,
          current_balance, available_balance, minimum_balance, interest_rate,
          last_interest_date, total_interest_earned, account_status, opening_date,
          auto_save_amount, auto_save_frequency, next_auto_save_date,
          daily_withdrawal_limit, monthly_deposit_limit, created_at, updated_at
        ) VALUES (
          ${savingsAccountId}::uuid, ${
        pensioner.pensioner_id
      }::uuid, ${accountNumber},
          ${`${pensioner.first_name} ${pensioner.last_name} - Voluntary Savings`},
          2500000, 2500000, 50000, 0.08,
          '2024-01-01'::date, 125000, 'ACTIVE', '2023-06-15'::date,
          100000, 'MONTHLY', '2025-02-01'::date,
          5000000, 50000000, NOW(), NOW()
        )
      `;

      console.log(
        `Created voluntary savings account for ${pensioner.first_name} ${pensioner.last_name}`
      );

      // Create sample transactions
      for (let j = 0; j < 3; j++) {
        const transactionId = crypto.randomUUID();
        const transactionAmount = 500000 + j * 250000;
        const refNumber = `TXN${String(i * 3 + j + 1).padStart(8, "0")}`;

        await prisma.$executeRaw`
          INSERT INTO savings_transactions (
            transaction_id, savings_account_id, transaction_type, transaction_amount,
            transaction_fee, net_amount, balance_before, balance_after,
            description, reference_number, external_reference, transaction_status,
            transaction_date, value_date, processed_date, payment_method,
            bank_reference, created_at, updated_at
          ) VALUES (
            ${transactionId}::uuid, ${savingsAccountId}::uuid, 'DEPOSIT', ${transactionAmount},
            5000, ${transactionAmount - 5000}, ${
          2500000 - transactionAmount
        }, 2500000,
            ${`Monthly voluntary savings deposit #${j + 1}`}, ${refNumber},
            ${
              "BANK_REF_" + String(i * 3 + j + 1).padStart(6, "0")
            }, 'COMPLETED',
            NOW() - INTERVAL '${3 - j} months', NOW() - INTERVAL '${
          3 - j
        } months',
            NOW() - INTERVAL '${3 - j} months', 'BANK_TRANSFER',
            ${"BNK_" + String(i * 3 + j + 1).padStart(8, "0")}, NOW(), NOW()
          )
        `;
      }

      // Create interest transaction
      const interestTxnId = crypto.randomUUID();
      const interestRefNumber = `INT${String(i + 1).padStart(8, "0")}`;

      await prisma.$executeRaw`
        INSERT INTO savings_transactions (
          transaction_id, savings_account_id, transaction_type, transaction_amount,
          transaction_fee, net_amount, balance_before, balance_after,
          description, reference_number, transaction_status,
          transaction_date, value_date, processed_date, payment_method,
          created_at, updated_at
        ) VALUES (
          ${interestTxnId}::uuid, ${savingsAccountId}::uuid, 'INTEREST_CREDIT', 125000,
          0, 125000, 2375000, 2500000,
          'Quarterly interest payment', ${interestRefNumber}, 'COMPLETED',
          '2024-12-31'::date, '2024-12-31'::date, '2024-12-31'::date, 'SYSTEM_CREDIT',
          NOW(), NOW()
        )
      `;

      // Create mid-term access application for first pensioner
      if (i === 0) {
        const applicationId = crypto.randomUUID();
        const applicationNumber = `MTA${new Date().getFullYear()}001`;

        await prisma.$executeRaw`
          INSERT INTO midterm_access_applications (
            application_id, pensioner_id, savings_account_id, application_number,
            access_reason, other_reason_details, requested_amount, approved_amount,
            total_contributions, eligible_amount, max_allowable_amount, percentage_requested,
            application_status, current_approval_level, justification, supporting_documents,
            emergency_contact, emergency_phone, submission_date, review_start_date,
            processing_notes, repayment_required, created_at, updated_at
          ) VALUES (
            ${applicationId}::uuid, ${pensioner.pensioner_id}::uuid, ${savingsAccountId}::uuid,
            ${applicationNumber}, 'EDUCATION',
            'University fees for child pursuing Engineering degree', 15000000, NULL,
            25000000, 20000000, 20000000, 75.00,
            'UNDER_REVIEW', 'SUPERVISOR_REVIEW',
            'My daughter has been admitted to Makerere University for a Bachelor of Engineering degree. I need to access part of my voluntary savings to pay for her tuition fees for the first semester.',
            ARRAY['/documents/university_admission_letter.pdf', '/documents/fee_structure.pdf', '/documents/student_id_copy.pdf'],
            'Sarah Mukasa (Daughter)', '+256701234567', NOW(), NOW(),
            'Application received and initial documentation review completed.', false,
            NOW(), NOW()
          )
        `;

        console.log(
          `Created mid-term access application: ${applicationNumber}`
        );

        // Create approval workflow
        const workflowLevels = [
          "INITIAL_REVIEW",
          "SUPERVISOR_REVIEW",
          "MANAGER_APPROVAL",
        ];
        const userRoles = ["SUPPORT_STAFF", "SUPPORT_STAFF", "FINANCE_OFFICER"];

        for (let k = 0; k < workflowLevels.length; k++) {
          const workflowId = crypto.randomUUID();
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + (k + 1) * 3);

          await prisma.$executeRaw`
            INSERT INTO midterm_approval_workflow (
              workflow_id, application_id, approval_level, approver_role,
              status, assigned_date, completed_date, due_date,
              decision, comments, created_at, updated_at
            ) VALUES (
              ${workflowId}::uuid, ${applicationId}::uuid, ${
            workflowLevels[k]
          }, ${userRoles[k]},
              ${k === 0 ? "COMPLETED" : "PENDING"}, NOW(),
              ${
                k === 0 ? "NOW()" : "NULL"
              }, ${dueDate.toISOString()}::timestamp,
              ${k === 0 ? "APPROVED" : "NULL"},
              ${
                k === 0
                  ? "Documentation is complete and meets requirements. Forwarding to supervisor for review."
                  : "NULL"
              },
              NOW(), NOW()
            )
          `;
        }

        // Create supporting documents
        const documentTypes = [
          "University Admission Letter",
          "Fee Structure",
          "Student ID Copy",
          "Birth Certificate",
        ];

        for (let d = 0; d < documentTypes.length; d++) {
          const docId = crypto.randomUUID();
          const docType = documentTypes[d];
          const fileName = docType.replace(/\s+/g, "_").toLowerCase() + ".pdf";

          await prisma.$executeRaw`
            INSERT INTO midterm_supporting_documents (
              document_id, application_id, document_type, document_name, file_path,
              file_size, mime_type, verification_status, verification_date,
              verification_notes, is_required, is_original_required,
              uploaded_at, created_at, updated_at
            ) VALUES (
              ${docId}::uuid, ${applicationId}::uuid, ${docType}, ${fileName},
              ${`/uploads/midterm/${applicationNumber}/${fileName}`},
              ${245760 + d * 51200}, 'application/pdf',
              ${d < 3 ? "VERIFIED" : "UNDER_REVIEW"},
              ${d < 3 ? "NOW()" : "NULL"},
              ${d < 3 ? "Document verified and authentic" : "NULL"},
              ${d < 3}, ${d === 0}, NOW(), NOW(), NOW()
            )
          `;
        }

        console.log(`Created ${documentTypes.length} supporting documents`);
      }
    }

    console.log(
      "\n✅ Voluntary Savings and Mid-term Access data seeded successfully!"
    );
    console.log("\nCreated:");
    console.log(`- ${pensioners.length} Voluntary Savings Accounts`);
    console.log(`- ${pensioners.length * 4} Sample Transactions`);
    console.log("- 1 Mid-term Access Application");
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
seedVoluntarySavingsRaw().catch((error) => {
  console.error("Failed to seed voluntary savings data:", error);
  process.exit(1);
});
