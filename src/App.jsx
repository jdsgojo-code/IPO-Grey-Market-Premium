import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const IpoDashboard = () => {
  const [ipoData, setIpoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSJzAdZ_ZCNWqYh-etaXRrytBJwPEOuSOGBAyjeiqCQBQ1nBnxGJxpcIVLE-SiTFYA0qQFWfThWkLCL/pub?gid=0&single=true&output=csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setIpoData(results.data);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchCSV();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#E1FF00] text-xl font-bold tracking-widest animate-pulse">
          SYNCING LIVE DATA...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 border-b border-white/10 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tighter">
              IPO <span className="text-[#E1FF00]">GMP</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">Market Intelligence Terminal</p>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ipoData.map((ipo, index) => {
            const keys = Object.keys(ipo);
            const name = ipo[keys[0]] || "Unknown";
            const price = ipo[keys[1]] || "N/A";
            const gmp = ipo[keys[2]] || "0";
            
            const isPositive = !String(gmp).includes('-');
            const gmpColor = isPositive ? 'text-[#E1FF00]' : 'text-red-500';

            return (
              <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-2xl">
                <h2 className="text-xl font-bold mb-4 truncate text-white">{name}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Issue Price</span>
                    <span className="font-mono text-gray-300">{price}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Current GMP</span>
                    <span className={`font-mono text-lg font-black ${gmpColor}`}>
                      {isPositive && gmp !== "0" && gmp !== "-" ? '+' : ''}{gmp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IpoDashboard;