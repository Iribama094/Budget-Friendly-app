import express from 'express';
const app = express();
app.use(express.json());

function simpleTaxCalc(grossAnnual) {
  const totalTax = Math.round(grossAnnual * 0.2);
  const netAnnual = grossAnnual - totalTax;
  const netMonthly = Math.round(netAnnual / 12);
  return { grossAnnual, taxableIncome: grossAnnual, totalTax, netAnnual, netMonthly, bands: [] };
}

app.post('/v1/tax/calc', (req, res) => {
  try {
    const { country, grossAnnual } = req.body || {};
    if (!grossAnnual) return res.status(400).json({ error: 'grossAnnual required' });
    const result = simpleTaxCalc(Number(grossAnnual));
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.MOCK_PORT || 3002;
app.listen(PORT, () => console.log(`Mock server listening on http://localhost:${PORT}`));
