const fs = require('fs');
const files = [
  'e:/healthcare management system/frontend/src/pages/Patients.jsx',
  'e:/healthcare management system/frontend/src/pages/Dashboard.jsx',
  'e:/healthcare management system/frontend/src/pages/Billing.jsx',
  'e:/healthcare management system/frontend/src/pages/Appointments.jsx'
];
files.forEach(f => {
  let cnt = fs.readFileSync(f, 'utf8');
  cnt = cnt.replace(/\.toLocaleDateString\(\)/g, ".toLocaleDateString('en-GB')");
  fs.writeFileSync(f, cnt);
});
console.log('Replaced');
