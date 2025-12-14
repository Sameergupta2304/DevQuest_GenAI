import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Leaf, 
  Activity, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- CONFIGURATION ---
// 1. Set to 'false' to connect to a real backend, 'true' for Demo Mode
const USE_MOCK_API = false; 

// 2. BACKEND CONNECTION DETAILS
// If running locally, keep as 'http://localhost:3000'
// If deployed, change to your live server URL (e.g., 'https://my-green-api.onrender.com')
const API_BASE_URL = 'https://dev-quest-gen-ai.vercel.app/';

// 3. API KEY (Paste your key inside the quotes below)
// This key will be sent in the headers (x-api-key) to your backend
const API_KEY = 'AIzaSyBEaMypVxt3Dhc6X5a0FsYIl-Ea6ozmngM'; 

export default function GreenInvoiceApp() {
  const [activeTab, setActiveTab] = useState('upload'); // upload, dashboard
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [data, setData] = useState<any>(null);

  // --- MOCK API SERVICE (Simulates the Backend Logic) ---
  const simulateProcessing = async () => {
    setIsProcessing(true);
    
    setProcessingStep('Scanning Document (OCR)...');
    await new Promise(r => setTimeout(r, 1500));
    
    setProcessingStep('AI Agent: Extracting Consumption Data...');
    await new Promise(r => setTimeout(r, 1500));
    
    setProcessingStep('Carbon Engine: Calculating Emissions...');
    await new Promise(r => setTimeout(r, 1000));
    
    setProcessingStep('Risk Analyst: Generating Report...');
    await new Promise(r => setTimeout(r, 1000));

    // Simulated Response
    const mockResponse = {
      items: [
        { id: 1, name: "Diesel Fuel (Generator)", quantity: 450, unit: "L", category: "Fuel", carbon_relevance: "High", co2: 1170, evidence: "450 Liters HSD" },
        { id: 2, name: "Grid Electricity", quantity: 1200, unit: "kWh", category: "Energy", carbon_relevance: "High", co2: 984, evidence: "1200 Units" },
        { id: 3, name: "Packaging (Plastic)", quantity: 80, unit: "kg", category: "Materials", carbon_relevance: "Medium", co2: 480, evidence: "80kg Poly-wrap" },
        { id: 4, name: "Office Paper", quantity: 20, unit: "kg", category: "Office Supplies", carbon_relevance: "Low", co2: 26, evidence: "20kg A4" }
      ],
      totalCo2: 2660,
      riskReport: {
        summary: "The entity's carbon intensity is HIGH due to significant reliance on diesel fuel for backup power generation.",
        top_drivers: ["Diesel Fuel (44%)", "Grid Electricity (37%)", "Plastic Packaging (18%)"],
        recommendations: [
          "Retrofit diesel generators with hybrid solar inputs.",
          "Switch packaging supplier to biodegradable alternatives."
        ]
      }
    };

    setData(mockResponse);
    setIsProcessing(false);
    setActiveTab('dashboard');
  };

  const handleFileUpload = async () => {
    if (USE_MOCK_API) {
      simulateProcessing();
      return;
    }

    // --- REAL BACKEND CONNECTION ---
    try {
      setIsProcessing(true);
      setProcessingStep('Uploading to Backend...');

      // 1. Prepare Data
      // In a real app, you would send a FormData object with the file.
      // For this MVP, we simulate sending the OCR text directly to our API.
      const payload = {
        filename: "uploaded_invoice_demo.pdf",
        ocrText: "RAW DATA: 500 L Diesel Fuel, 1200 kWh Electricity Bill, 50 kg Printer Paper" 
      };

      setProcessingStep('AI Agents Processing...');

      // 2. Call the API
      // We now use the API_BASE_URL and API_KEY constants defined at the top
      const response = await fetch(`${API_BASE_URL}/api/analyze-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY, // Sending the API Key in headers
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      setProcessingStep('Finalizing Report...');
      await new Promise(r => setTimeout(r, 500));

      // 3. Map Backend Data to Frontend Format
      // The backend returns: { data: [...], risk: {...}, total: ... }
      // We map it to our state structure:
      const mappedData = {
        items: result.data,
        totalCo2: result.total,
        riskReport: result.risk
      };

      setData(mappedData);
      setIsProcessing(false);
      setActiveTab('dashboard');

    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert(`Error: Could not connect to backend at ${API_BASE_URL}. \n\nCheck your API Key and ensure the server is running!`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* --- FORCE FULL SCREEN OVERRIDE --- 
          This style block forcefully resets default Vite/CSS layout constraints 
          that might be limiting the width in index.css 
      */}
      <style>{`
        :root {
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
        body {
          display: block !important;
          place-items: unset !important;
          min-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #root {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          text-align: left !important;
        }
      `}</style>

      {/* Header */}
      <header className="bg-emerald-900 text-white p-4 shadow-lg w-full">
        <div className="w-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">Green Invoice <span className="text-emerald-400 font-light">| ESG Auditor</span></h1>
          </div>
          <div className="text-xs text-emerald-200 bg-emerald-800 px-3 py-1 rounded-full">
            Mode: {USE_MOCK_API ? "Simulated" : "Connected (Real API)"}
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-8">
        
        {/* VIEW: UPLOAD */}
        {activeTab === 'upload' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">AI-Powered Scope 3 Auditor</h2>
              <p className="text-lg text-slate-500 max-w-2xl">Upload invoices to automatically extract, categorize, and calculate energy, fuel, and material carbon footprints.</p>
            </div>

            <div className="w-full max-w-2xl bg-white p-12 rounded-3xl shadow-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-all cursor-pointer group hover:shadow-2xl hover:scale-[1.01]" onClick={handleFileUpload}>
              {isProcessing ? (
                <div className="flex flex-col items-center space-y-6">
                  <Loader2 className="h-16 w-16 text-emerald-600 animate-spin" />
                  <div className="text-center">
                    <p className="font-semibold text-xl text-slate-700">Processing Document</p>
                    <p className="text-base text-slate-400 mt-1">{processingStep}</p>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden max-w-md">
                    <div className="h-full bg-emerald-500 animate-pulse w-2/3"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-6">
                  <div className="p-6 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors">
                    <Upload className="h-12 w-12 text-emerald-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-bold text-2xl text-slate-700">Click to Upload Invoice</p>
                    <p className="text-slate-400">Supports PDF, PNG, JPG (Max 10MB)</p>
                  </div>
                  <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition shadow-md hover:shadow-lg">Select File</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full max-w-5xl">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <FileText className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-slate-800">IDP Extraction</h3>
                <p className="text-sm text-slate-500 mt-1">Extracts usage data from unstructured/messy PDFs</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <Activity className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-slate-800">Carbon Engine</h3>
                <p className="text-sm text-slate-500 mt-1">Maps line items to specific emission factors</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <ShieldAlert className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-slate-800">Risk Analysis</h3>
                <p className="text-sm text-slate-500 mt-1">Flags high-carbon vendors & intensity spikes</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {activeTab === 'dashboard' && data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Carbon Footprint</p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-4xl font-bold text-slate-900">{data.totalCo2.toLocaleString()}</span>
                  <span className="text-sm font-medium text-slate-400">kg CO2e</span>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Items Processed</p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-4xl font-bold text-slate-900">{data.items.length}</span>
                  <span className="text-sm font-medium text-slate-400">line items</span>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Audit Status</p>
                <div className="flex items-center space-x-2 mt-2">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                  <span className="text-2xl font-bold text-emerald-600">Verified</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column: Tables & Charts */}
              <div className="xl:col-span-2 space-y-8">
                
                {/* Extraction Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800">Extracted Line Items</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">IDP Agent Output</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-8 py-4 font-semibold">Item Name</th>
                          <th className="px-8 py-4 font-semibold">Quantity</th>
                          <th className="px-8 py-4 font-semibold">Category</th>
                          <th className="px-8 py-4 font-semibold text-right">Emissions (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.items.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-4">
                              <div className="font-semibold text-slate-900 text-base">{item.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">Evidence: <span className="font-mono bg-slate-100 px-1 rounded">{item.evidence}</span></div>
                            </td>
                            <td className="px-8 py-4">
                              <span className="bg-slate-100 px-2.5 py-1.5 rounded-md text-slate-700 font-mono font-medium">
                                {item.quantity} {item.unit}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                ${item.category === 'Fuel' ? 'bg-red-50 text-red-700 border-red-100' : 
                                  item.category === 'Energy' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                {item.category}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-right font-bold text-slate-800 text-base">
                              {item.co2 ? item.co2.toLocaleString() : 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Charts */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">Emission Breakdown by Category</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.items} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="category" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{fill: '#f1f5f9'}}
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="co2" fill="#10b981" radius={[6, 6, 0, 0]} barSize={60} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Right Column: Risk Report */}
              <div className="space-y-6">
                
                {/* Risk Analyst Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                  <div className="bg-slate-900 p-5">
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-500/20 p-2 rounded-lg">
                        <ShieldAlert className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">ESG Risk Analyst</h3>
                        <p className="text-slate-400 text-xs">Automated Assessment</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6 flex-grow">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Executive Summary</p>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {data.riskReport.summary}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Top Emission Drivers</p>
                      <div className="space-y-2">
                        {data.riskReport.top_drivers && data.riskReport.top_drivers.map((driver: string, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm bg-red-50 px-4 py-3 rounded-lg text-red-900 border border-red-100">
                            <span className="font-medium">{driver}</span>
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Bank Recommendations</p>
                      <ul className="text-sm space-y-3">
                        {data.riskReport.recommendations && data.riskReport.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors -mx-2">
                            <div className="mt-1 bg-emerald-100 p-1 rounded-full shrink-0">
                              <ArrowRight className="h-3 w-3 text-emerald-600" />
                            </div>
                            <span className="text-slate-600">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 border-t border-slate-100 text-center">
                    <button onClick={() => setActiveTab('upload')} className="text-sm text-emerald-700 font-bold hover:text-emerald-800 hover:underline transition-all">
                      Scan Another Invoice
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}