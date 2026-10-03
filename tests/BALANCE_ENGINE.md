# Balance engine: installazione e collaudo

## Stato

Implementazione locale pronta; migrazione Supabase ancora da applicare.
Il 02/10/2026 la verifica REST read-only dei dati reali ha confermato 123 movimenti,
10 checkpoint, origine certified 23536.74, saldo 40327.63 e coerenza di ogni balance/derived.
Questo risultato è PRE-installazione, non una certificazione del rilascio.

## Unico passaggio di installazione database

Nel SQL Editor Supabase, come `postgres`, eseguire integralmente
`supabase/migrations/20261002160000_balance_engine.sql`.
Il file contiene anche le verifiche read-only finali: `baseline_passed` deve essere
`true`, la query dei mesi mancanti deve restituire zero righe.
L'installazione non scrive amount, balance o checkpoint e non chiama ensure/rebuild.
Non revoca DML sulle tabelle. Richiede assenza delle nuove funzioni, come nel preflight;
non rieseguire una migrazione già installata.

Applicare il database prima di usare il nuovo frontend. Le vecchie API di scrittura
non sono fallback: se le RPC mancano, la nuova UI segnala un errore.

## Test locali

```sh
node --check js/app.js
node --test tests/balance-engine-frontend.test.js
```

Test SQL isolati, senza credenziali Supabase e senza cambi alle dipendenze di produzione:

```sh
npm install --prefix /tmp/personal-economy-balance-validation @electric-sql/pglite
BALANCE_TEST_RUNTIME=/tmp/personal-economy-balance-validation/package.json node tests/balance-engine-database.test.js
```

Il fixture riproduce schema/vincoli finanziari, 123 movimenti e 10 checkpoint,
con gli stessi importi di chiusura del preflight. Le date dei mesi si adattano al
mese corrente per mantenere il test ripetibile. `tags.name` è text nel fixture:
la semantica citext del catalogo non è coinvolta nel motore finanziario.
PGlite è PostgreSQL isolato, ma non collauda Auth/RLS reali né due connessioni concorrenti.

## Accettazione live dopo installazione

1. Controllare le query read-only finali della migrazione.
2. Accedere con un utente autorizzato, aprire Movimenti. In rete deve comparire
   `ensure_balance_checkpoints` una volta per mese/sessione pagina; il risultato
   atteso sui dati originali è `rebuilt: false`.
3. Aprire un movimento: la lettura del saldo deve usare `get_account_balance`.
4. Salvare senza cambi, poi modificare solo Tag, descrizione, `in_totals` sul primo
   movimento. Ogni salvataggio deve fare una sola `save_transaction`, restituire
   `financial_changed: false` e `rebuilds: []`, senza ulteriori ensure al reload
   nello stesso mese. Ripristinare i metadati se necessario.
5. Eseguire `node scripts/verify-balance-engine.js` (usa il .env locale senza
   mostrare credenziali), oppure le SELECT di `scripts/verify-balance-engine.sql`.
   Devono restare 123 movimenti, 10 checkpoint, certified 23536.74, saldo 40327.63,
   con zero differenze. Non accettare il rilascio prima di questo risultato.

## Test finanziari su ambiente di collaudo

Gli scenari mutativi si eseguono su staging/fixture, non sulla produzione ripristinata:
amount ottobre (base settembre), settembre (base agosto), luglio (base giugno),
date settembre->luglio e luglio->settembre, insert/delete retroattivi, cambio conto,
conto privo di certified, Tag inesistente, errore in mezzo al rebuild, date nel
periodo certified, checkpoint derived mancante/corrotto, mesi vuoti, passaggio d'anno,
ordine identico date/created_at e migliaia di movimenti. Riconciliare sempre dal certified.
I test isolati coprono questi comportamenti; i permessi reali vanno confermati su Supabase.

Per la concorrenza utilizzare due sessioni PostgreSQL su staging: la prima apre una
transazione ed esegue una RPC finanziaria senza commit; la seconda esegue un'altra RPC
finanziaria e deve attendere. Commit della prima, completamento della seconda e
riconciliazione indipendente finale. Senza edit_version prevale l'ultimo salvataggio.

## Contratto e limiti intenzionali

- `p_tag_ids`: array JSON di ID bigint come stringhe; `null` conserva i Tag, `[]` li rimuove.
- L'account caricato dal movimento viene preservato; la UI resta senza nuovo selettore conto.
- Il frontend mantiene lo stesso tx_id dell'INSERT sui retry. Una risposta persa può
  produrre un errore duplicato: verificare l'elenco; non reinserire con nuova identità.
- La preview non calcola un saldo ipotetico: il database determina il risultato al salvataggio.
- La manutenzione si ripete al cambio mese Europe/Rome o dopo un nuovo accesso alla pagina.
- La verifica della cache legge gli importi storici server-side, ma aggiorna soltanto
  dal primo mese interessato o incoerente. Non ci sono query N+1 del frontend.
- Nessun fallback a zero; nessun checkpoint corrente; certified immutabile UPDATE/DELETE.
- DML diretto ancora consentito secondo la fase concordata: può bypassare il protocollo
  di lock. La chiusura dei privilegi del vecchio percorso resta successiva al collaudo.
- L'allowlist/autorizzazione completa, edit_version e idempotenza non sono introdotti.
- Nessun commit/push eseguito. Le modifiche preesistenti del repository sono preservate.

## File interessati da questa implementazione

- js/app.js
- supabase/migrations/20261002160000_balance_engine.sql
- scripts/verify-balance-engine.sql
- scripts/verify-balance-engine.js
- tests/balance-engine-frontend.test.js
- tests/balance-engine-database.test.js
- tests/BALANCE_ENGINE.md
- movimenti.html (testo preview e versione asset)

Solo aggiornamento della versione dell'asset JavaScript nelle altre pagine:
index.html, patrimonio.html, composizione.html, dossier.html, titoli.html,
insert-movimenti.html, insert-titoli.html, tags.html, admin-db-schema.html,
admin-dossiers.html, admin-investments-basis-events.html, admin-portfolio-assets.html,
admin-portfolio-basis-events.html.
