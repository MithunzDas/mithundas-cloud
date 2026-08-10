// This is the JavaScript code for the "Prepare Booking Data" n8n Code node.
// Copy-paste this directly into the Code node editor in n8n.
// DO NOT use the JSON file to import this code — paste it manually.

const item = $input.first()?.json?.body || $input.first()?.json || {};
const isReschedule = item.event === 'meeting_rescheduled';

const name = item.name || 'Client';
const email = item.email || '';
const company = item.company || 'Client Business';
const businessType = item.businessType || 'General';
const projectRequirement = item.projectRequirement || 'None';
const date = item.date || item.newDate || '';
const time = item.time || item.newTime || '';
const timeZone = item.timeZone || item.newTimeZone || 'IST';
const bookingId = item.bookingId || '';
const meetUrl = item.meetUrl || '';
const meetingStartISO = item.meetingStartISO || new Date().toISOString();
const bookedAt = item.bookedAt || new Date().toISOString();

const clientSubject = isReschedule
  ? '🔄 Session Rescheduled — ' + company + ' | Mithun Das'
  : 'Discovery Session Confirmed — ' + company + ' | Mithun Das';

const hostSubject = isReschedule
  ? '🔄 MEETING RESCHEDULED: ' + company + ' (' + name + ')'
  : '📅 NEW MEETING: ' + company + ' (' + name + ')';

const rescheduleLink = 'https://mithundas.cloud/book/reschedule?bookingId=' + bookingId;

const clientTitle = isReschedule ? 'Your Session Has Been Rescheduled! 🔄' : 'Your Discovery Session is Confirmed! 🎉';
const hostTitle = isReschedule ? '🔄 Meeting Rescheduled!' : '🎉 New Discovery Call Booked!';

const headerBlock = '<div style="font-family: Arial, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">' +
  '<div style="height: 4px; background: linear-gradient(90deg, #0ea5e9, #6366f1, #0ea5e9);"></div>' +
  '<div style="padding: 24px 32px 18px 32px; border-bottom: 1px solid #f1f5f9;">' +
  '<table cellpadding="0" cellspacing="0" style="border: none;"><tr>' +
  '<td style="vertical-align: middle; padding-right: 12px;">' +
  '<img src="https://mithundas.cloud/logo.png" alt="M" style="width: 38px; height: 38px; border-radius: 8px; display: block;">' +
  '</td><td style="vertical-align: middle;">' +
  '<span style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">Mithun Das</span><br>' +
  '<span style="font-family: Arial, sans-serif; font-size: 10px; color: #0ea5e9; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px;">AI AUTOMATION</span>' +
  '</td></tr></table></div>';

const footerBlock = '<div style="padding: 0 32px;"><div style="border-top: 1px solid #f1f5f9;"></div></div>' +
  '<div style="padding: 24px 32px 28px 32px;">' +
  '<table cellpadding="0" cellspacing="0" style="border: none;"><tr>' +
  '<td style="padding-right: 16px; border-right: 2px solid #0ea5e9; vertical-align: middle;">' +
  '<img src="https://mithundas.cloud/logo.png" alt="M" style="width: 42px; height: 42px; border-radius: 8px; display: block;">' +
  '</td><td style="padding-left: 16px; vertical-align: middle;">' +
  '<span style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 700; color: #0f172a;">Mithun Das</span><br>' +
  '<span style="font-family: Arial, sans-serif; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Founder &amp; Automation Architect</span><br>' +
  '<a href="https://mithundas.cloud" style="font-family: Arial, sans-serif; font-size: 12px; color: #0ea5e9; text-decoration: none; font-weight: 600;">Mithun Das AI Automation</a>' +
  '</td></tr></table></div>' +
  '<div style="height: 3px; background: linear-gradient(90deg, #0ea5e9, #6366f1, #0ea5e9);"></div></div>';

const detailsBlock = '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin: 20px 0; font-family: monospace; font-size: 13px; color: #0f172a;">' +
  '<div style="margin-bottom: 8px;"><b>📅 Date &amp; Time:</b> ' + date + ' @ ' + time + ' (' + timeZone + ')</div>' +
  '<div style="margin-bottom: 8px;"><b>🆔 Reference:</b> ' + bookingId + '</div>' +
  '<div><b>🎥 Video Room:</b> <a href="' + meetUrl + '" style="color: #0ea5e9; font-weight: bold; text-decoration: underline;">' + meetUrl + '</a></div>' +
  '</div>';

const clientHtml = headerBlock +
  '<div style="padding: 28px 32px; font-size: 15px; color: #334155; line-height: 1.7;">' +
  '<h2 style="font-size: 20px; color: #0f172a; margin: 0 0 12px 0;">' + clientTitle + '</h2>' +
  '<p style="margin: 0 0 16px 0;">Hi <b>' + name + '</b>,</p>' +
  '<p style="margin: 0 0 16px 0;">Your 15-minute AI Architecture Discovery Session for <b>' + company + '</b> is confirmed. Below are your session details:</p>' +
  detailsBlock +
  '</div>' +
  '<div style="padding: 0 32px 28px 32px; text-align: center;">' +
  '<a href="' + meetUrl + '" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);">🚀 Join Video Meeting Room Now</a>' +
  '<div style="margin-top: 14px;">' +
  '<a href="' + rescheduleLink + '" style="color: #64748b; font-size: 12px; font-family: Arial, sans-serif; text-decoration: underline;">🔄 Need to Reschedule Your Session? Click Here</a>' +
  '</div></div>' +
  footerBlock;

const hostDetailsBlock = '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin-bottom: 20px; font-family: monospace; font-size: 13px; color: #0f172a;">' +
  '<div style="margin-bottom: 6px;"><b>👤 Client Name:</b> ' + name + '</div>' +
  '<div style="margin-bottom: 6px;"><b>🏢 Company:</b> ' + company + ' (' + businessType + ')</div>' +
  '<div style="margin-bottom: 6px;"><b>✉️ Email:</b> ' + email + '</div>' +
  '<div style="margin-bottom: 6px;"><b>📅 Date &amp; Time:</b> ' + date + ' @ ' + time + ' (' + timeZone + ')</div>' +
  '<div><b>🆔 Booking Reference:</b> ' + bookingId + '</div>' +
  '</div>';

const hostHeaderBlock = '<div style="font-family: Arial, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">' +
  '<div style="height: 4px; background: linear-gradient(90deg, #10b981, #0ea5e9, #10b981);"></div>' +
  '<div style="padding: 24px 32px 18px 32px; border-bottom: 1px solid #f1f5f9;">' +
  '<span style="font-size: 18px; font-weight: 800; color: #0f172a;">' + hostTitle + '</span>' +
  '</div>';

const hostFooterBlock = '<div style="height: 3px; background: linear-gradient(90deg, #10b981, #0ea5e9, #10b981);"></div></div>';

const hostHtml = hostHeaderBlock +
  '<div style="padding: 28px 32px; font-size: 15px; color: #334155; line-height: 1.7;">' +
  hostDetailsBlock +
  '<div style="margin-bottom: 20px;">' +
  '<b style="font-size: 13px; font-family: monospace; color: #64748b; text-transform: uppercase;">Project Requirements / SOW:</b>' +
  '<div style="background: #f1f5f9; border-radius: 8px; padding: 14px; margin-top: 6px; font-size: 13px; color: #1e293b; white-space: pre-wrap;">' + projectRequirement + '</div>' +
  '</div></div>' +
  '<div style="padding: 0 32px 28px 32px;">' +
  '<a href="' + meetUrl + '" style="display: inline-block; background: linear-gradient(135deg, #10b981, #0ea5e9); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;">🎥 Join Host Video Meeting Room</a>' +
  '</div>' +
  hostFooterBlock;

const telegramText = (isReschedule ? '🔄 MEETING RESCHEDULED!\n\n' : '🎉 NEW DISCOVERY CALL BOOKED!\n\n') +
  '👤 Client: ' + name + '\n' +
  '🏢 Company: ' + company + '\n' +
  '💼 Industry: ' + businessType + '\n' +
  '✉️ Email: ' + email + '\n' +
  '📅 Scheduled Date: ' + date + ' @ ' + time + ' (' + timeZone + ')\n' +
  '🆔 Reference: ' + bookingId + '\n\n' +
  '🎥 Video Room Link:\n' + meetUrl + '\n\n' +
  '📋 SOW / Requirements:\n' + projectRequirement;

return [{
  json: {
    event: isReschedule ? 'meeting_rescheduled' : 'meeting_booked',
    name,
    email,
    company,
    businessType,
    projectRequirement,
    date,
    time,
    timeZone,
    bookingId,
    meetUrl,
    meetingStartISO,
    bookedAt,
    clientSubject,
    hostSubject,
    clientHtml,
    hostHtml,
    telegramText
  }
}];
