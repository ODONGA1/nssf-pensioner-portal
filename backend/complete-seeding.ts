import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function completeSeeding() {
  try {
    console.log("Completing the voluntary savings seeding...\n");

    // Get the existing application
    const applications = (await prisma.$queryRaw`
      SELECT application_id, application_number 
      FROM midterm_access_applications 
      LIMIT 1
    `) as Array<{
      application_id: string;
      application_number: string;
    }>;

    if (applications.length === 0) {
      console.log("No applications found to complete");
      return;
    }

    const application = applications[0];
    console.log(`Found application: ${application.application_number}`);

    // Add workflow steps if not exist
    const existingWorkflow = (await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM midterm_approval_workflow 
      WHERE application_id = ${application.application_id}::uuid
    `) as Array<{ count: string }>;

    if (parseInt(existingWorkflow[0].count) === 0) {
      console.log("Adding approval workflow steps...");

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
            ${workflowId}::uuid, ${application.application_id}::uuid, 
            ${workflowLevels[k]}::"MidtermApprovalLevel", ${
          userRoles[k]
        }::"UserRole",
            ${k === 0 ? "COMPLETED" : "PENDING"}, NOW(),
            ${k === 0 ? new Date() : null}, ${dueDate.toISOString()}::timestamp,
            ${k === 0 ? "APPROVED" : null},
            ${
              k === 0
                ? "Documentation is complete and meets requirements."
                : null
            },
            NOW(), NOW()
          )
        `;
      }

      console.log(`Added ${workflowLevels.length} workflow steps`);
    } else {
      console.log("Workflow steps already exist");
    }

    // Add supporting documents if not exist
    const existingDocs = (await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM midterm_supporting_documents 
      WHERE application_id = ${application.application_id}::uuid
    `) as Array<{ count: string }>;

    if (parseInt(existingDocs[0].count) === 0) {
      console.log("Adding supporting documents...");

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
            uploaded_at, uploaded_by, created_at, updated_at
          ) VALUES (
            ${docId}::uuid, ${
          application.application_id
        }::uuid, ${docType}, ${fileName},
            ${`/uploads/midterm/${application.application_number}/${fileName}`},
            ${245760 + d * 51200}, 'application/pdf',
            ${
              d < 3 ? "VERIFIED" : "UNDER_REVIEW"
            }::"DocumentVerificationStatus",
            ${d < 3 ? new Date() : null},
            ${d < 3 ? "Document verified and authentic" : null},
            ${d < 3}, ${d === 0}, NOW(), null, NOW(), NOW()
          )
        `;
      }

      console.log(`Added ${documentTypes.length} supporting documents`);
    } else {
      console.log("Supporting documents already exist");
    }

    // Add more savings accounts for the second pensioner if needed
    const savingsCount = (await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM voluntary_savings_accounts
    `) as Array<{ count: string }>;

    if (parseInt(savingsCount[0].count) < 2) {
      console.log("Adding second voluntary savings account...");

      const pensioners = (await prisma.$queryRaw`
        SELECT pensioner_id, first_name, last_name, nssf_number 
        FROM pensioners 
        ORDER BY first_name
        LIMIT 2
      `) as Array<{
        pensioner_id: string;
        first_name: string;
        last_name: string;
        nssf_number: string;
      }>;

      if (pensioners.length > 1) {
        const pensioner = pensioners[1]; // Second pensioner
        const accountNumber = `VS${pensioner.nssf_number.slice(-6)}02`;
        const savingsAccountId = crypto.randomUUID();

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
            1800000, 1800000, 50000, 0.08,
            '2024-01-01'::date, 90000, 'ACTIVE', '2023-08-15'::date,
            75000, 'MONTHLY', '2025-02-01'::date,
            3000000, 30000000, NOW(), NOW()
          )
        `;

        // Add some transactions for this account
        for (let j = 0; j < 2; j++) {
          const transactionId = crypto.randomUUID();
          const transactionAmount = 300000 + j * 150000;
          const refNumber = `TXN${String(10 + j + 1).padStart(8, "0")}`;

          await prisma.$executeRaw`
            INSERT INTO savings_transactions (
              transaction_id, savings_account_id, transaction_type, transaction_amount,
              transaction_fee, net_amount, balance_before, balance_after,
              description, reference_number, external_reference, transaction_status,
              transaction_date, value_date, processed_date, payment_method,
              bank_reference, created_at, updated_at
            ) VALUES (
              ${transactionId}::uuid, ${savingsAccountId}::uuid, 'DEPOSIT', ${transactionAmount},
              3000, ${transactionAmount - 3000}, ${
            1800000 - transactionAmount
          }, 1800000,
              ${`Voluntary savings deposit #${j + 1}`}, ${refNumber},
              ${"BANK_REF_" + String(10 + j + 1).padStart(6, "0")}, 'COMPLETED',
              NOW() - INTERVAL '${2 - j} months', NOW() - INTERVAL '${
            2 - j
          } months',
              NOW() - INTERVAL '${2 - j} months', 'MOBILE_MONEY',
              ${"MOB_" + String(10 + j + 1).padStart(8, "0")}, NOW(), NOW()
            )
          `;
        }

        console.log(
          `Created second savings account for ${pensioner.first_name} ${pensioner.last_name}`
        );
      }
    }

    console.log(
      "\n✅ Voluntary Savings and Mid-term Access modules completed successfully!"
    );
  } catch (error) {
    console.error("Error completing seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

completeSeeding();
