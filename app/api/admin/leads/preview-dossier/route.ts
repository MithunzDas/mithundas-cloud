import { NextResponse } from "next/server";

export async function GET() {
  const hostEmail = "mithun.here01@gmail.com";
  const clientTitle = "Apex Automation Labs (Johnathan Vance)";
  const suggestedSOW = "Deliver an enterprise multi-channel lead routing engine integrating Next.js, n8n workflows, OpenAI document parsing, and real-time CRM synchronization with automated 50% deposit billing.";
  
  const paymentClarification = {
    totalFee: "$3,500 USD",
    depositPercentage: "50% ($1,750 USD) upfront to initiate sprint",
    milestones: "Phase 1 intake delivered in 7 days; full system deployment in 21 days",
  };
  
  const budgetAndTimeline = "$3,500 total fee, 50% upfront deposit ($1,750), start date immediate upon deposit receipt.";
  
  const clientPainPoints = [
    "Losing 35% of inbound leads due to slow manual email responses (> 4 hours delay)",
    "Manual data entry between client intake forms and internal CRM consuming 15+ hours weekly",
    "No standardized discovery SOW or immediate deposit invoice collection on discovery calls"
  ];
  
  const requiredWorkflows = [
    "Next.js High-Speed Intake Form & Instant Webhook Router",
    "OpenAI Document Parser & Qualification Score Engine",
    "Hostinger / Resend Automated Email Dispatch to Host & Client",
    "Automated Invoice & Deposit Tracking Pipeline"
  ];

  const technicalImplementationPlan = `### Phase 1: Ingestion & Lead Validation Architecture
- Deploy Next.js serverless API routes with Zod validation.
- Implement secure webhook handoff to processing queue.

### Phase 2: AI Intelligence & Scoring Pipeline
- Integrate OpenAI Whisper for discovery audio analysis.
- Run GPT-4o-mini structured schema extraction for executive SOW and payment clarification.

### Phase 3: Financial Settlement & Client Onboarding
- Generate digital invoice on mithundas.cloud with deposit milestones.
- Automated email dispatch of executive dossier to host email.`;

  const painPointsHtml = clientPainPoints
    .map(pt => `<li style="padding:4px 0;color:#e0e0e8;">${pt}</li>`)
    .join("");

  const workflowsHtml = requiredWorkflows
    .map(wf => `<li style="padding:4px 0;color:#38bdf8;"><strong>${wf}</strong></li>`)
    .join("");

  const formattedPlan = technicalImplementationPlan
    .replace(/\n/g, "<br/>")
    .replace(/###/g, "<br/><strong>")
    .replace(/##/g, "<br/><strong>");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Post-Call Executive Dossier Preview</title></head>
<body style="margin:0;padding:0;background:#080b11;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080b11;padding:40px 16px;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#0f172a;border-radius:14px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">

  <!-- Header Banner -->
  <tr><td style="background:linear-gradient(135deg,#0284c7 0%,#4f46e5 100%);padding:28px 36px;">
    <div style="font-size:11px;font-family:monospace;letter-spacing:1.5px;color:rgba(255,255,255,0.8);text-transform:uppercase;margin-bottom:6px;">MITHUN DAS • AI AUTOMATION ARCHITECT</div>
    <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">🎯 Discovery Session Executive Dossier</h1>
    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.9);">Complete Post-Call Statement of Work, Payment Scope &amp; Implementation Plan</p>
  </td></tr>

  <!-- Client Snapshot Bar -->
  <tr><td style="padding:20px 36px;background:#131d33;border-bottom:1px solid #1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;font-family:monospace;">
      <tr>
        <td style="color:#94a3b8;padding:4px 0;">CLIENT: <strong style="color:#f8fafc;font-family:sans-serif;">Johnathan Vance</strong></td>
        <td style="color:#94a3b8;padding:4px 0;">COMPANY: <strong style="color:#38bdf8;font-family:sans-serif;">Apex Automation Labs</strong></td>
      </tr>
      <tr>
        <td style="color:#94a3b8;padding:4px 0;">EMAIL: <strong style="color:#f8fafc;">jvance@apexlabs.io</strong></td>
        <td style="color:#94a3b8;padding:4px 0;">ROOM REF: <span style="color:#a5b4fc;">#call-disc-89241</span></td>
      </tr>
    </table>
  </td></tr>

  <!-- Main Body Content -->
  <tr><td style="padding:32px 36px;">

    <!-- 1. SOW Section -->
    <div style="margin-bottom:28px;background:#080b11;border:1px solid #0284c7;border-left:4px solid #0ea5e9;border-radius:10px;padding:20px;">
      <div style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#38bdf8;font-weight:700;letter-spacing:1px;margin-bottom:8px;">📋 Executive Statement of Work (SOW)</div>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#ffffff;font-weight:600;">
        ${suggestedSOW}
      </p>
    </div>

    <!-- 2. Financial Terms & Payment Received -->
    <div style="margin-bottom:28px;background:#080b11;border:1px solid #10b981;border-left:4px solid #10b981;border-radius:10px;padding:20px;">
      <div style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#34d399;font-weight:700;letter-spacing:1px;margin-bottom:12px;">💰 Financial &amp; Payment Clarification</div>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;line-height:1.6;">
        <tr>
          <td style="padding:6px 0;color:#94a3b8;width:160px;">Total Fee / Pricing:</td>
          <td style="padding:6px 0;color:#f8fafc;font-weight:700;font-size:15px;">${paymentClarification.totalFee}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#94a3b8;">Deposit Required:</td>
          <td style="padding:6px 0;color:#34d399;font-weight:700;">${paymentClarification.depositPercentage}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#94a3b8;">Kickoff &amp; Delivery:</td>
          <td style="padding:6px 0;color:#f8fafc;">${paymentClarification.milestones}</td>
        </tr>
      </table>
      
      <div style="margin-top:12px;padding-top:10px;border-top:1px solid #1e293b;font-size:12px;color:#94a3b8;">
        <span style="font-family:monospace;color:#64748b;">Raw Financial Notes:</span> ${budgetAndTimeline}
      </div>
    </div>

    <!-- 3. What Needs to Be Done (Required Workflows) -->
    <div style="margin-bottom:28px;">
      <div style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#38bdf8;font-weight:700;letter-spacing:1px;margin-bottom:10px;">⚙️ What Needs to Be Done (Workflows to Build)</div>
      <div style="background:#080b11;border:1px solid #1e293b;border-radius:10px;padding:18px 22px;">
        <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.7;">
          ${workflowsHtml}
        </ul>
      </div>
    </div>

    <!-- 4. Client Pain Points & Bottlenecks -->
    <div style="margin-bottom:28px;">
      <div style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#f59e0b;font-weight:700;letter-spacing:1px;margin-bottom:10px;">⚠️ Client Pain Points &amp; Operational Bottlenecks</div>
      <div style="background:#080b11;border:1px solid #1e293b;border-radius:10px;padding:18px 22px;">
        <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.7;">
          ${painPointsHtml}
        </ul>
      </div>
    </div>

    <!-- 5. Technical Implementation Architecture Plan -->
    <div style="margin-bottom:32px;">
      <div style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#a855f7;font-weight:700;letter-spacing:1px;margin-bottom:10px;">🏗️ Step-by-Step Technical Implementation Plan</div>
      <div style="background:#080b11;border:1px solid #1e293b;border-radius:10px;padding:20px;font-size:12px;line-height:1.8;color:#cbd5e1;">
        ${formattedPlan}
      </div>
    </div>

    <!-- Next Action CTA Button -->
    <div style="text-align:center;padding:10px 0 16px;">
      <a href="https://mithundas.cloud/admin/finance" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 34px;border-radius:10px;box-shadow:0 4px 15px rgba(14,165,233,0.35);">
        🚀 Open Admin Invoicing to Issue Deposit Invoice ➔
      </a>
      <p style="margin:12px 0 0;font-size:11px;color:#64748b;">Or review lead details at <a href="https://mithundas.cloud/admin/leads" style="color:#38bdf8;text-decoration:none;">mithundas.cloud/admin/leads</a></p>
    </div>

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 36px;border-top:1px solid #1e293b;background:#080b11;text-align:center;">
    <p style="margin:0;font-size:11px;color:#475569;font-family:monospace;">
      Direct Host Notification • Delivered straight to ${hostEmail} • Telegram alerts suppressed
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
