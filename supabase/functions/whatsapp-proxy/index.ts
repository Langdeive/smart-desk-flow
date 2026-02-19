import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const WEBHOOKS = [
      "https://n8n.solveflow.cloud/webhook/whatsapp-send",
      "https://n8n.solveflow.cloud/webhook-test/whatsapp-send",
    ];

    const results = await Promise.allSettled(
      WEBHOOKS.map((url) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).then(async (res) => {
          const ct = res.headers.get("content-type") ?? "";
          const data = ct.includes("application/json") ? await res.json() : await res.text();
          return { url, status: res.status, ok: res.ok, data };
        })
      )
    );

    const responses = results.map((r) =>
      r.status === "fulfilled" ? r.value : { url: "unknown", ok: false, error: r.reason?.message }
    );

    const allOk = responses.every((r) => r.ok);

    return new Response(JSON.stringify({ results: responses }), {
      status: allOk ? 200 : 207,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
