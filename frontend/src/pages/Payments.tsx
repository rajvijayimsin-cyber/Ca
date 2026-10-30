import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Alert, Table, TableHead, TableBody, TableRow, TableCell, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress } from '@mui/material';
import api from '../api';
import { loadSession, isStaff } from '../auth/session';
import { fmtDate, fmtMoney, statusLabel, tx } from '../i18n';

// Invoices: staff raise them; the person who owes one pays it here.
// Without gateway keys every payment is simulated and the screen says so.
const DEFAULT_CURRENCY = "USD";
const ZERO = ["CLP", "JPY", "KRW", "VND"];
const money = (cents: number, ccy: string) => fmtMoney((cents || 0) / (ZERO.includes(ccy) ? 1 : 100), ccy);
const SERVER_DOWN = "This needs the app's server, which is not running yet. Nothing was sent.";

const loadScript = (src: string) => new Promise<void>((ok, fail) => {
  if (document.querySelector(`script[src="${src}"]`)) return ok();
  const s = document.createElement('script'); s.src = src; s.onload = () => ok(); s.onerror = () => fail(new Error('script'));
  document.body.appendChild(s);
});

const Payments: React.FC = () => {
  const [staff, setStaff] = useState(true);
  const [gw, setGw] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [payers, setPayers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [demo, setDemo] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);
  const [refunding, setRefunding] = useState<any>(null);
  const [reason, setReason] = useState('');
  // Saved cards. Only the brand and last four digits ever reach this page.
  const [cards, setCards] = useState<any[]>([]);
  const [newCard, setNewCard] = useState<any>(null);
  const [removing, setRemoving] = useState<any>(null);

  const fail = (e: any, fallback: string) => {
    const st = e?.response?.status;
    // the server's refusals are written in English; shown in the app's language
    setError(!st || st === 404 ? tx(SERVER_DOWN) : (e?.response?.data?.detail ? tx(String(e.response.data.detail)) : fallback));
  };
  const load = () => api.get('/api/billing/invoices').then(r => { setRows(Array.isArray(r.data) ? r.data : []); setError(''); })
    .catch(e => fail(e, tx('Could not load the invoices.')));
  const loadCards = () => api.get('/api/payment_methods')
    .then(r => setCards(Array.isArray(r.data) ? r.data : Array.isArray(r.data?.items) ? r.data.items : []))
    .catch(() => setCards([]));
  const addCard = async () => {
    try { await api.post('/api/payment_methods', newCard); setNewCard(null); setNotice(tx('Card saved.')); loadCards(); }
    catch (e) { fail(e, tx('The card could not be saved.')); }
  };
  const removeCard = async () => {
    try { await api.delete('/api/payment_methods/' + removing.id); setRemoving(null); setNotice(tx('Card removed.')); loadCards(); }
    catch (e) { setRemoving(null); fail(e, tx('The card could not be removed.')); }
  };
  // A receipt is the paid invoice on its own page, ready to print.
  const printReceipt = (inv: any) => {
    const w = window.open('', '_blank', 'width=600,height=700');
    if (!w) return;
    const esc = (v: any) => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as any)[c]);
    w.document.write(`<html><head><title>Receipt ${esc(inv.number)}</title></head><body style="font-family:sans-serif;padding:24px">
      <h1>CareNest receipt</h1><p>Receipt ${esc(inv.number)}</p><p>${esc(inv.description)}</p>
      <p><strong>${esc(money(inv.amount_cents, inv.currency))}</strong></p><p>Status: ${esc(statusLabel(inv.status))}</p>
      <p style="color:#666;font-size:12px">CareNest connects families with independent caregivers. For medical emergencies call 911.</p>
      </body></html>`);
    w.document.close();
    w.print();
  };

  useEffect(() => {
    loadCards();
    loadSession().then(s => {
      const st = isStaff(s.role); setStaff(st);
      if (st) api.get('/api/billing/payers').then(r => setPayers(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    });
    api.get('/api/billing/gateway').then(r => setGw(r.data)).catch(() => {});
    load();
  }, []);

  const pay = async (inv: any) => {
    setBusy(inv.id); setError(''); setNotice('');
    try {
      const { data: co } = await api.post('/api/billing/invoices/' + inv.id + '/checkout', {});
      if (co.simulated) { setDemo(co); return; }
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      const rzp = new (window as any).Razorpay({
        key: co.key_id, order_id: co.order_id, amount: co.amount_cents, currency: co.currency,
        description: co.number + ' · ' + co.description,
        handler: async (resp: any) => {
          try {
            const { data: out } = await api.post('/api/billing/payments/' + co.payment_id + '/verify', resp);
            setNotice(out.status === 'paid' ? tx('Payment received. Thank you.')
              : tx('Your bank accepted the payment and is still confirming it. This page will show it as paid once the money arrives.'));
            load();
          } catch (e) { fail(e, tx('The payment could not be verified.')); }
        },
      });
      rzp.open();
    } catch (e) { fail(e, tx('The payment could not be started.')); }
    finally { setBusy(null); }
  };

  const simulate = async (token: string) => {
    try { await api.post('/api/billing/payments/' + demo.payment_id + '/simulate', { method_token: token }); setNotice(tx('Simulated payment recorded. No card was charged.')); }
    catch (e) { fail(e, tx('The simulated payment failed.')); }
    setDemo(null); load();
  };

  const raise = async () => {
    try { await api.post('/api/billing/invoices', { ...draft, currency: draft.currency || gw?.currency || DEFAULT_CURRENCY }); setDraft(null); load(); }
    catch (e) { fail(e, tx('The invoice could not be raised.')); }
  };
  const voidIt = async (inv: any) => {
    try { await api.post('/api/billing/invoices/' + inv.id + '/void', {}); load(); } catch (e) { fail(e, tx('The invoice could not be voided.')); }
  };
  const refund = async () => {
    try { await api.post('/api/billing/invoices/' + refunding.id + '/refund', { reason }); setRefunding(null); setReason(''); load(); }
    catch (e) { fail(e, tx('The refund did not go through.')); }
  };

  const who = (id: string) => (payers.find(p => p.id === String(id)) || {}).name || id;
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700, flex: 1 }}>Payments & Receipts</Typography>
        {staff && <Button variant="contained" onClick={() => setDraft({ user_id: '', description: '', amount: '', due_date: '' })} sx={{ textTransform: 'none' }}>New invoice</Button>}
      </Box>
      {gw && <Alert severity={gw.mode === 'live' ? 'success' : 'info'} sx={{ mb: 2 }}>{tx(gw.note)}</Alert>}
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
      {!staff && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography component="h2" sx={{ fontWeight: 600, flex: 1 }}>Saved cards</Typography>
            <Button variant="outlined" onClick={() => setNewCard({ token: '', brand: '', last4: '' })} sx={{ textTransform: 'none' }}>Add card</Button>
          </Box>
          {cards.length === 0 && <Typography sx={{ color: 'text.secondary' }}>No saved cards yet.</Typography>}
          {cards.map(c => (
            <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', py: 1, borderTop: 1, borderColor: 'divider' }}>
              <Typography sx={{ flex: 1 }}>{(c.brand || 'Card') + ' ending ' + (c.last4 || '••••')}{c.exp_month && c.exp_year ? ' · expires ' + c.exp_month + '/' + c.exp_year : ''}</Typography>
              <Button size="small" color="error" onClick={() => setRemoving(c)} sx={{ textTransform: 'none' }}>Remove</Button>
            </Box>
          ))}
        </Paper>
      )}
      <Typography component="h2" sx={{ fontWeight: 600, mb: 1 }}>Payment history</Typography>
      <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead><TableRow>
            <TableCell>Receipt</TableCell>{staff && <TableCell>Account</TableCell>}<TableCell>For</TableCell>
            <TableCell align="right">Amount</TableCell><TableCell>Due</TableCell><TableCell>Status</TableCell><TableCell />
          </TableRow></TableHead>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={7} sx={{ color: 'text.secondary' }}>No payments yet.</TableCell></TableRow>}
            {rows.map(inv => (
              <TableRow key={inv.id}>
                <TableCell>{inv.number}</TableCell>
                {staff && <TableCell>{who(inv.user_id)}</TableCell>}
                <TableCell>{inv.description}</TableCell>
                <TableCell align="right">{money(inv.amount_cents, inv.currency)}</TableCell>
                <TableCell>{inv.due_date ? fmtDate(inv.due_date) : '—'}</TableCell>
                <TableCell>
                  <Chip size="small" label={statusLabel(inv.status)} color={inv.status === 'paid' ? 'success' : inv.status === 'unpaid' ? 'warning' : 'default'} />
                  {(inv.payments || []).some((p: any) => p.status === 'authorized') && <Chip size="small" sx={{ ml: 0.5 }} label={tx('Bank confirming')} />}
                  {(inv.payments || []).some((p: any) => p.simulated && p.status === 'captured') && <Chip size="small" variant="outlined" sx={{ ml: 0.5 }} label={tx('Simulated')} />}
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  {!staff && inv.status === 'unpaid' && <Button size="small" variant="contained" disabled={busy === inv.id} onClick={() => pay(inv)} sx={{ textTransform: 'none' }}>
                    {busy === inv.id ? <CircularProgress size={14} color="inherit" /> : 'Pay'}</Button>}
                  {staff && inv.status === 'unpaid' && inv.paid_cents === 0 && <Button size="small" onClick={() => voidIt(inv)} sx={{ textTransform: 'none' }}>Void</Button>}
                  {inv.status === 'paid' && <Button size="small" onClick={() => printReceipt(inv)} sx={{ textTransform: 'none' }}>Print receipt</Button>}
                  {staff && inv.status === 'paid' && <Button size="small" color="inherit" onClick={() => setRefunding(inv)} sx={{ textTransform: 'none' }}>Refund</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={!!demo} onClose={() => setDemo(null)} fullWidth maxWidth="xs">
        <DialogTitle>Online payment is not set up yet</DialogTitle>
        <DialogContent>
          <Typography>This is a demo payment: no card is charged and no money moves.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDemo(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button color="inherit" onClick={() => simulate('tok_chargeDeclined')} sx={{ textTransform: 'none' }}>Simulate a declined card</Button>
          <Button variant="contained" onClick={() => simulate('tok_visa_4242')} sx={{ textTransform: 'none' }}>Simulate a payment</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!draft} onClose={() => setDraft(null)} fullWidth maxWidth="sm">
        <DialogTitle>New invoice</DialogTitle>
        <DialogContent>
          <TextField select fullWidth margin="dense" label="Account" value={draft?.user_id || ''} onChange={e => setDraft({ ...draft, user_id: e.target.value })}>
            {payers.map(p => <MenuItem key={p.id} value={p.id}>{p.name}{p.email && p.email !== p.name ? ' · ' + p.email : ''}</MenuItem>)}
          </TextField>
          <TextField fullWidth margin="dense" label="What it is for" value={draft?.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })} />
          <TextField fullWidth margin="dense" label={tx('Amount ({currency})', { currency: gw?.currency || DEFAULT_CURRENCY })} inputMode="decimal" value={draft?.amount || ''} onChange={e => setDraft({ ...draft, amount: e.target.value })} />
          <TextField fullWidth margin="dense" type="date" label="Due" InputLabelProps={{ shrink: true }} value={draft?.due_date || ''} onChange={e => setDraft({ ...draft, due_date: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDraft(null)}>Cancel</Button>
          <Button variant="contained" disabled={!draft?.user_id || !draft?.description || !draft?.amount} onClick={raise}>Raise invoice</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!newCard} onClose={() => setNewCard(null)} fullWidth maxWidth="xs">
        <DialogTitle>Add card</DialogTitle>
        <DialogContent>
          {/* The card number goes to the payment provider, never to this app;
              without gateway keys this saves a test card and says so. */}
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 1 }}>
            {gw?.mode === 'live' ? tx('Your card is stored by our payment provider. CareNest never sees the full number.') : tx('Online payment is not set up yet, so this saves a test card. No card is charged.')}
          </Typography>
          <TextField select fullWidth margin="dense" label="Card" value={newCard?.token || ''} onChange={e => setNewCard({ ...newCard, token: e.target.value })}>
            <MenuItem value="tok_visa">Visa test card</MenuItem>
            <MenuItem value="tok_mastercard">Mastercard test card</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCard(null)}>Cancel</Button>
          <Button variant="contained" disabled={!newCard?.token} onClick={addCard}>Save card</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!removing} onClose={() => setRemoving(null)} fullWidth maxWidth="xs">
        <DialogTitle>Remove this card?</DialogTitle>
        <DialogContent>
          <Typography>{(removing?.brand || 'Card') + ' ending ' + (removing?.last4 || '••••')} will no longer be available for bookings.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoving(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={removeCard}>Remove</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!refunding} onClose={() => setRefunding(null)} fullWidth maxWidth="sm">
        <DialogTitle>Refund this invoice</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth multiline minRows={2} margin="dense" label="Why the money is being returned" value={reason} onChange={e => setReason(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefunding(null)}>Cancel</Button>
          <Button variant="contained" color="error" disabled={reason.trim().length < 3} onClick={refund}>Refund</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;
