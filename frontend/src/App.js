import React, { useState } from "react";
import { isConnected, requestAccess } from "@stellar/freighter-api";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState("create");

  const [buyer, setBuyer] = useState("");
  const [seller, setSeller] = useState("");
  const [credits, setCredits] = useState("");

  const [wallet, setWallet] = useState(null);
  const [result, setResult] = useState(null);

  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const [history, setHistory] = useState([]);

  // ---------- HELPERS ----------
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ---------- API ----------
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5001/history");
      setHistory(res.data.data);
    } catch {
      showToast("Error fetching history");
    }
  };

  const verifyTrade = async () => {
    try {
      const res = await axios.post("http://localhost:5001/verify", {
        hash: verifyHash,
      });
      setVerifyResult(res.data.exists);
    } catch {
      showToast("Error verifying trade");
    }
  };

  const connectWallet = async () => {
    const response = await isConnected();
    if (!response.isConnected) {
      showToast("Freighter not available");
      return;
    }

    const access = await requestAccess();

    if (access.error) {
      showToast("Connection failed");
    } else {
      setWallet(access.address);
      showToast("Wallet Connected");
    }
  };

  const submitTrade = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/trade", {
        buyer,
        seller,
        credits: Number(credits),
      });

      setResult(res.data);
      showToast("Trade successful 🎉");
    } catch {
      showToast("Error sending trade ❌");
    }
    setLoading(false);
  };

  // ---------- STYLES ----------
  const styles = {
    wrapper: {
      minHeight: "100vh",
      backgroundColor: "#0a0f1e",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif",
      padding: "20px",
    },

    accentOrb: {
      position: "fixed",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      filter: "blur(80px)",
      opacity: 0.4,
      zIndex: 0,
      top: "10%",
      left: "20%",
    },

    glassCard: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      maxWidth: "460px",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(30px)",
      borderRadius: "24px",
      border: "1px solid rgba(255,255,255,0.125)",
      padding: "40px",
      boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      color: "#fff",
    },

    tabContainer: {
      display: "flex",
      marginBottom: "30px",
      background: "rgba(0,0,0,0.2)",
      borderRadius: "12px",
      padding: "4px",
    },

    tab: (active) => ({
      flex: 1,
      padding: "10px",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      background: active ? "rgba(255,255,255,0.15)" : "transparent",
      color: active ? "#fff" : "rgba(255,255,255,0.5)",
    }),

    input: {
      boxSizing: "border-box",
      width: "100%",
      maxWidth: "100%",
      padding: "14px",
      marginBottom: "16px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(255,255,255,0.05)",
      color: "#fff",
    },

    buttonPrimary: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      background: "#fff",
      color: "#0a0f1e",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "10px",
    },

    buttonSecondary: {
      width: "100%",
      padding: "10px",
      borderRadius: "12px",
      background: "transparent",
      border: "1px solid rgba(255,255,255,0.2)",
      color: "#fff",
      marginBottom: "10px",
    },

    toast: {
      position: "fixed",
      bottom: "30px",
      background: "#fff",
      color: "#000",
      padding: "12px 24px",
      borderRadius: "30px",
    },
  };

  const thStyle = {
    padding: "10px",
    textAlign: "left",
    color: "rgba(255,255,255,0.7)",
  };

  const tdStyle = {
    padding: "10px",
  };

  // ---------- UI ----------
  return (
    <div style={styles.wrapper}>
      <div style={styles.accentOrb}></div>

      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.glassCard}>
        <h2 style={{ textAlign: "center", fontWeight: "300", letterSpacing: "1px", marginBottom: "30px" }}>
          CRYPTO<span style={{ fontWeight: "700" }}>LEDGER</span>
        </h2>

        <div style={styles.tabContainer}>
          {["create", "verify", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={styles.tab(activeTab === t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CREATE */}
        {activeTab === "create" && (
          <>
            <input
              placeholder="Buyer"
              style={styles.input}
              value={buyer}
              onChange={(e) => setBuyer(e.target.value)}
            />
            <input
              placeholder="Seller"
              style={styles.input}
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
            />
            <input
              type="number"
              placeholder="Credits"
              style={styles.input}
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />

            <button onClick={connectWallet} style={styles.buttonSecondary}>
              {wallet
                ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
                : "Connect Wallet"}
            </button>

            <button
              onClick={submitTrade}
              disabled={!wallet || loading}
              style={{ ...styles.buttonPrimary, opacity: !wallet ? 0.5 : 1 }}
            >
              {loading ? "Processing..." : "Submit"}
            </button>

            {/* ✅ TRANSACTION DETAILS */}
            {result && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.08)",
                  fontSize: "12px",
                  wordBreak: "break-all",
                }}
              >
                <h4 style={{ marginBottom: "10px" }}>
                  Transaction Details
                </h4>

                <p><b>Wallet:</b><br />{wallet}</p>
                <p><b>Hash:</b><br />{result.hash}</p>
                <p><b>Transaction ID:</b><br />{result.transactionId}</p>
              </div>
            )}
          </>
        )}

        {/* VERIFY */}
        {activeTab === "verify" && (
          <>
            <input
              placeholder="Enter hash"
              style={styles.input}
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
            />

            <button
              onClick={verifyTrade}
              disabled={!verifyHash}
              style={styles.buttonPrimary}
            >
              Verify
            </button>

            {verifyResult !== null && (
              <p style={{ textAlign: "center" }}>
                {verifyResult ? "✅ Valid" : "❌ Not Found"}
              </p>
            )}
          </>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <>
            <button onClick={fetchHistory} style={styles.buttonSecondary}>
              Load History
            </button>

            {history.length > 0 && (
              <table style={{ width: "100%", marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Buyer</th>
                    <th style={thStyle}>Seller</th>
                    <th style={thStyle}>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((t, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{t.buyer}</td>
                      <td style={tdStyle}>{t.seller}</td>
                      <td style={tdStyle}>{t.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
