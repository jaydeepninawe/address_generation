"use client";
import { useState } from "react";
import secrets from "secrets.js-34r7h"; // SSR-safe

export default function WalletGenerator() {
  const [wallet, setWallet] = useState(null);
  const [shards, setShards] = useState([]);
  const [reconInputs, setReconInputs] = useState(["", "", ""]);
  const [reconstructedKey, setReconstructedKey] = useState("");

  const generateWallet = async () => {
    // Dynamically import coinkey ONLY in the browser
    const CoinKeyModule = await import("coinkey");
    const CoinKey = CoinKeyModule.default || CoinKeyModule;
    const newWallet = CoinKey.createRandom();
    const privateKeyHex = newWallet.privateKey.toString("hex");
    const shares = secrets.share(privateKeyHex, 5, 3);
    setWallet({
      privateKey: privateKeyHex,
      publicKey: newWallet.publicKey.toString("hex"),
      address: newWallet.publicAddress,
    });
    setShards(shares);
    setReconstructedKey("");
    setReconInputs(["", "", ""]);
  };

  const copyToClipboard = (text) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const handleReconInputChange = (idx, value) => {
    const updated = [...reconInputs];
    updated[idx] = value;
    setReconInputs(updated);
  };

  const reconstructPrivateKey = () => {
    try {
      const usedShards = reconInputs.filter(Boolean);
      if (usedShards.length < 3) {
        setReconstructedKey("Please enter at least 3 shards.");
        return;
      }
      const reconstructed = secrets.combine(usedShards);
      setReconstructedKey(reconstructed);
    } catch (err) {
      setReconstructedKey("Invalid shards or combination.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Bitcoin Wallet Generator
        </h1>
        <button
          onClick={generateWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition mb-8"
        >
          Generate New Wallet
        </button>
        {wallet && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Private Key
              </label>
              <div className="flex items-center justify-between">
                <span className="font-mono text-red-600 break-all pr-2">
                  {wallet.privateKey}
                </span>
                <button
                  onClick={() => copyToClipboard(wallet.privateKey)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Public Key
              </label>
              <div className="flex items-center justify-between">
                <span className="font-mono text-blue-600 break-all pr-2">
                  {wallet.publicKey}
                </span>
                <button
                  onClick={() => copyToClipboard(wallet.publicKey)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Bitcoin Address
              </label>
              <div className="flex items-center justify-between">
                <span className="font-mono text-green-600 break-all pr-2">
                  {wallet.address}
                </span>
                <button
                  onClick={() => copyToClipboard(wallet.address)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Private Key Shards (5 shares, threshold 3)
              </label>
              <ol className="list-decimal pl-4 space-y-2">
                {shards.map((shard, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span className="font-mono text-purple-600 break-all pr-2">
                      {shard}
                    </span>
                    <button
                      onClick={() => copyToClipboard(shard)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      Copy
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-2">
                Reconstruct Private Key (enter any 3 shards)
              </label>
              <div className="space-y-2 mb-2">
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={reconInputs[idx]}
                    onChange={(e) => handleReconInputChange(idx, e.target.value)}
                    className="w-full font-mono border border-gray-300 rounded px-2 py-1"
                    placeholder={`Shard #${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={reconstructPrivateKey}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Reconstruct Key
              </button>
              {reconstructedKey && (
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">
                    Reconstructed Private Key:
                  </span>
                  <div className="font-mono text-red-600 break-all">
                    {reconstructedKey}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
