const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

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

// Contact form handler — saves leads to data/leads.json
app.post('/api/contact', (req, res) => {
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

  const leadsFile = path.join(__dirname, 'data/leads.json');
  let leads = [];

  try {
    if (fs.existsSync(leadsFile)) {
      leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
    }
  } catch (e) {
    leads = [];
  }

  leads.push(lead);
  fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));

  console.log(`\n✅ NEW LEAD: ${name} — ${phone} — ${property || 'No property listed'}`);

  res.json({ success: true, message: 'Thank you! We\'ll be in touch within 24 hours.' });
});

// 404
app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`\n🏠 ATX Trash Valet running at http://${HOST}:${PORT}\n`);
});
