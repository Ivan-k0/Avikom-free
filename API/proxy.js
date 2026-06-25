
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const symbols = ['HG=F', 'ALI=F', 'NI=F', 'PB=F'];
  const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,bid,ask,regularMarketTime`;

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
