"use client";
import { useState } from 'react';
import CoinKey from 'coinkey';

export default function Home() {
  const [wallet, setWallet] = useState(null);

  const generateWallet = () => {
    const newWallet = CoinKey.createRandom();
    setWallet({
      privateKey: newWallet.privateKey.toString('hex'),
      publicKey: newWallet.publicKey.toString('hex'),
      address: newWallet.publicAddress
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Bitcoin Wallet Generator
        </h1>
        
        <button 
          onClick={generateWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-8"
        >
          Generate New Wallet
        </button>

        {wallet && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-1">
                private Key               </label>
              <div className="flex items-center justify-between">
                <span className="font-mono text-red-600 break-all pr-2">
                  {wallet.privateKey}
                </span>
                <button 
                  onClick={() => copyToClipboard(wallet.privateKey)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-1">
                public Key
              </label>
              <div className="flex items-center justify-between">
                <span className="font-mono text-blue-600 break-all pr-2">
                  {wallet.publicKey}
                </span>
                <button 
                  onClick={() => copyToClipboard(wallet.publicKey)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Bitcoin address
              </label>
              <div className="flex items-center justify-between">
                <span className="font-mono text-green-600 break-all pr-2">
                  {wallet.address}
                </span>
                <button 
                  onClick={() => copyToClipboard(wallet.address)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  
                </button>
              </div>
            </div>

            
          </div>
        )}
      </div>
    </div>
  );
}
