import axios from "axios";
import os from "os";

export async function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] ?? []) {
      if (iface && iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  throw new Error("Aucune IP locale trouvée");
}

async function buildCallbackUrl() {
  const ip = await getLocalIP();
  return `http://${ip}:${process.env.PORT}/chat`;
}

export async function subscribe(serviceUrl) {
  const callback = await buildCallbackUrl();
  if (!serviceUrl) throw new Error("serviceUrl requis");
  const { data } = await axios.post(`${serviceUrl.replace(/\/+$/,"")}/api/hook`, { callback });
  return { ok: true, callback, data };
}

export async function unsubscribe(serviceUrl) {
  const callback = await buildCallbackUrl();
  if (!serviceUrl) throw new Error("serviceUrl requis");
  const { data } = await axios.delete(`${serviceUrl.replace(/\/+$/,"")}/api/hook`, { data: { callback } });
  return { ok: true, callback, data };
}

export async function autoSubscribe({ serviceUrl, port, intervalMs = 15000 }) {
  if (!serviceUrl) {
    console.warn("[subscribe] SERVICE_URL manquant");
    return () => {};
  }
  let timer = null;

  const tryOnce = async () => {
    const cb = await buildCallbackUrl();

    try {
      const { status } = await axios.post(`${serviceUrl}/api/hook`, { callback: cb }, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      });
      console.log(`[subscribe] OK ${status} → ${cb}`);
      if (timer) clearInterval(timer);
      timer = null;
    } catch (e) {
      console.warn(`[subscribe] FAIL → ${cb}`, e?.response?.data || e.message);
    }
  };

  tryOnce();
  timer = setInterval(tryOnce, intervalMs);
  return () => { if (timer) clearInterval(timer); };
}