const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'luke@austinmdg.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Clean URL routes
const pages = [
  'index', 'contact', 'services', 'about', 'areas-served',
  'trash-valet-service', 'bulk-trash-pickup', 'faq',
  'pricing', 'property-managers',
  'downtown-austin-trash-valet', 'south-austin-trash-valet',
  'north-austin-trash-valet', 'east-austin-trash-valet',
  'west-austin-trash-valet', 'the-domain-trash-valet',
  'mueller-trash-valet', 'round-rock-trash-valet'
];
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
pages.filter(p => p !== 'index').forEach(p => {
  app.get('/' + p, (_req, res) => res.sendFile(path.join(__dirname, 'public/' + p + '.html')));
});

// Contact form handler — saves leads to data/leads.json and sends email
app.post('/api/contact', async (req, res) => {
  const { name, phone, property, units, message, source } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required.' });
  }

  const lead = {
    id: Date.now(),
    name,
    phone,
    property: property || '',
    units: units || '',
    message: message || '',
    source: source || 'website',
    timestamp: new Date().toISOString()
  };

  // Save to leads file
  const dataDir = path.join(__dirname, 'data');
  const leadsFile = path.join(dataDir, 'leads.json');
  let leads = [];

  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    if (fs.existsSync(leadsFile)) {
      leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
    }
  } catch (e) {
    leads = [];
  }

  leads.push(lead);
  fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));

  console.log(`\n✅ NEW LEAD: ${name} — ${phone} — ${property || 'No property listed'}`);

  // Send email notification
  const mailOptions = {
    from: 'luke@austinmdg.com',
    to: 'luke@austinmdg.com',
    subject: `New Free Quote Request — ${name}`,
    html: `
      <h2>New Quote Request from ATX Trash Valet Website</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Property</td><td style="padding:8px;border:1px solid #ddd;">${property || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Number of Units</td><td style="padding:8px;border:1px solid #ddd;">${units || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #ddd;">${message || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Source</td><td style="padding:8px;border:1px solid #ddd;">${source || 'website'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Submitted At</td><td style="padding:8px;border:1px solid #ddd;">${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} (CT)</td></tr>
      </table>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email notification sent for lead: ${name}`);
  } catch (err) {
    console.error(`❌ Failed to send email notification: ${err.message}`);
  }

  res.json({ success: true, message: 'Thank you! We\'ll be in touch within 24 hours.' });
});

// 404
app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`\n🏠 ATX Trash Valet running at http://${HOST}:${PORT}\n`);
});
