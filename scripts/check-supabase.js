import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Errore: configura SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nel file .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await supabase.from("portfolio_snapshots").select("*").limit(1);

if (error) {
  console.error("Errore lettura portfolio_snapshots:", error.message);
  process.exit(1);
}

console.log("Connessione OK");
console.log("Colonne ricevute:", Object.keys(data?.[0] ?? {}));
