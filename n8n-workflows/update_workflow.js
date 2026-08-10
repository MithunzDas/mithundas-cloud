const fs = require('fs');
const path = require('path');

const rawCode = fs.readFileSync(path.join(__dirname, 'prepare-booking-data.js'), 'utf8');
const cleanCode = rawCode.split('\n').filter(l => !l.startsWith('//')).join('\n').trim();

const wfPath = path.join(__dirname, 'meeting-confirmation-reminders.json');
const wf = JSON.parse(fs.readFileSync(wfPath, 'utf8'));

// 1. Update Prepare Booking Data jsCode
const prepNode = wf.nodes.find(n => n.name === 'Prepare Booking Data');
if (prepNode) {
  prepNode.parameters.jsCode = cleanCode;
}

// 2. Update IF conditions for slot verification to strict boolean
const if10 = wf.nodes.find(n => n.name === 'Is Slot Still Active? (10-Min)');
if (if10) {
  if10.parameters.conditions = {
    boolean: [
      {
        value1: '={{ $json.active === true }}',
        value2: true
      }
    ]
  };
}

const if1h = wf.nodes.find(n => n.name === 'Is Slot Still Active? (1-Hour)');
if (if1h) {
  if1h.parameters.conditions = {
    boolean: [
      {
        value1: '={{ $json.active === true }}',
        value2: true
      }
    ]
  };
}

// 3. Update HTML fields of reminder emails
const rem10Email = wf.nodes.find(n => n.name === 'Send 10-Min Reminder Email');
if (rem10Email) {
  rem10Email.parameters.html = "={{ $('Prepare Booking Data').first().json.reminder10MinHtml }}";
}

const rem1hEmail = wf.nodes.find(n => n.name === 'Send 1-Hour Reminder Email');
if (rem1hEmail) {
  rem1hEmail.parameters.html = "={{ $('Prepare Booking Data').first().json.reminder1HourHtml }}";
}

fs.writeFileSync(wfPath, JSON.stringify(wf, null, 2), 'utf8');
console.log('Successfully updated workflow JSON via node script!');
