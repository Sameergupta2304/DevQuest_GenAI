require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Invoice = require('./models'); // Import the Mongoose Model

const app = express();
app.use(cors());
app.use(express.json());

const express = require('express');
const cors = require('cors'); // <--- 1. ADD THIS


// ... rest of your code ...

// 1. MongoDB Connection
// Make sure MongoDB is running locally or provide your Atlas URI

// ✅ Corrected: Removed the options object AND the semicolon
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// Mock AI Function (Simulates Prompts 2, 3, 4, 5)
async function processInvoiceWithAI(ocrText) {
    console.log("Processing OCR Text with AI Agents...");

    // SIMULATED OUTPUT FROM IDP AGENT
    const extractedItems = [
        { name: "Diesel Fuel", quantity: 500, unit: "L", category: "Fuel", carbon_relevance: "High", evidence: "500 L Diesel", confidence: 0.98 },
        { name: "Electricity Bill", quantity: 1200, unit: "kWh", category: "Energy", carbon_relevance: "High", evidence: "1200 kWh Consumed", confidence: 0.95 },
        { name: "Printer Paper", quantity: 50, unit: "kg", category: "Office Supplies", carbon_relevance: "Low", evidence: "50 kg A4 Paper", confidence: 0.90 }
    ];

    // CALCULATION LOGIC
    const factors = {
        "Diesel Fuel": 2.6,
        "Electricity Bill": 0.82,
        "Printer Paper": 1.3
    };

    const itemsWithCalc = extractedItems.map(item => {
        const factor = factors[item.name] || 0;
        return {
            ...item,
            carbon_calculation: {
                emission_factor: factor,
                total_co2_kg: item.quantity * factor
            }
        };
    });

    const totalEmission = itemsWithCalc.reduce((sum, item) => sum + item.carbon_calculation.total_co2_kg, 0);

    // SIMULATED RISK REPORT
    const riskReport = {
        summary: "The entity shows high carbon intensity due to reliance on diesel generators.",
        top_drivers: ["Diesel Fuel (68%)", "Grid Electricity (30%)"],
        recommendations: [
            "Switch to solar hybrid generators to reduce diesel dependency.",
            "Procure recycled paper to lower Scope 3 waste emissions."
        ]
    };

    return { itemsWithCalc, riskReport, totalEmission };
}

// API Endpoint: Upload and Process
app.post('/api/analyze-invoice', async (req, res) => {
    const { filename, ocrText } = req.body;

    try {
        // 1. Run AI Pipeline
        const { itemsWithCalc, riskReport, totalEmission } = await processInvoiceWithAI(ocrText);

        // 2. Create MongoDB Document
        const newInvoice = new Invoice({
            filename,
            raw_ocr_text: ocrText,
            status: 'PROCESSED',
            items: itemsWithCalc,
            risk_report: riskReport,
            total_co2_kg: totalEmission
        });

        // 3. Save to Database
        await newInvoice.save();

        console.log(`Saved Invoice ID: ${newInvoice._id}`);

        // 4. Return formatted response for Frontend
        // We map _id to id to match what the React frontend expects
        res.json({
            success: true,
            invoiceId: newInvoice._id,
            data: itemsWithCalc.map(i => ({
                ...i,
                id: i._id, // Map Mongo ID
                co2: i.carbon_calculation.total_co2_kg // Map for frontend convenience
            })),
            risk: riskReport,
            total: totalEmission
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Processing failed" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Green Invoice Server running on port ${PORT}`));