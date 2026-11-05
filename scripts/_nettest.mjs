const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
try {
  const r = await fetch('https://fonts.googleapis.com/css2?family=Archivo:wght@400&display=swap', { headers: { 'User-Agent': ua } });
  console.log('GF_STATUS', r.status);
  const css = await r.text();
  console.log('CSS_LEN', css.length);
  console.log('HAS_WOFF2', css.includes('woff2'));
} catch (e) {
  console.log('GF_ERR', e.message);
}
try {
  const r2 = await fetch('https://fonts.gstatic.com/', { headers: { 'User-Agent': ua } });
  console.log('GS_STATUS', r2.status);
} catch (e) {
  console.log('GS_ERR', e.message);
}
