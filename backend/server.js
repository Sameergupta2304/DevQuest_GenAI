require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. Import CORS

const app = express();

// 2. ENABLE CORS (This fixes the "Failed to fetch" error)
// This allows your Vercel frontend to talk to this backend
app.use(cors({
  origin: '*', // Allow all domains (easiest for debugging)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

app.use(express.json());

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 4. Routes
app.get('/', (req, res) => {
  res.send('Green Invoice API is Running!');
});

app.post('/api/analyze-invoice', (req, res) => {
  console.log("Analyze Invoice Request Received");
  
  // Mock logic to match your frontend expectation
  // In a real app, this would use the AI Agent logic
  const responseData = {
    data: [
      { id: 1, name: "Diesel Fuel", quantity: 500, unit: "L", category: "Fuel", co2: 1300, evidence: "OCR Extraction" },
      { id: 2, name: "Electricity", quantity: 1200, unit: "kWh", category: "Energy", co2: 984, evidence: "OCR Extraction" },
      { id: 3, name: "Paper", quantity: 50, unit: "kg", category: "Office Supplies", co2: 65, evidence: "OCR Extraction" }
    ],
    total: 2349,
    risk: {
      summary: "High reliance on diesel fuel detected.",
      top_drivers: ["Diesel (55%)", "Electricity (42%)"],
      recommendations: ["Switch to solar hybrid generators."]
    }
  };

  // Simulate delay
  setTimeout(() => {
    res.json(responseData);
  }, 1000);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));