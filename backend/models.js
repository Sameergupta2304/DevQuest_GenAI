const mongoose = require('mongoose');

// 1. Schema for Individual Line Items (Embedded)
const InvoiceItemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
    category: String, // Energy, Fuel, Materials
    carbon_relevance: { type: String, enum: ['High', 'Medium', 'Low'] },
    evidence: String,
    confidence: Number,
    // Embed the calculation directly in the item
    carbon_calculation: {
        emission_factor: Number,
        total_co2_kg: Number
    }
});

// 2. Schema for the Risk Report (Embedded)
const RiskReportSchema = new mongoose.Schema({
    summary: String,
    top_drivers: [String],
    recommendations: [String],
    generated_at: { type: Date, default: Date.now }
});

// 3. Main Invoice Schema
const InvoiceSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    upload_date: { type: Date, default: Date.now },
    status: { type: String, enum: ['PENDING', 'PROCESSED', 'FAILED'], default: 'PENDING' },
    raw_ocr_text: String,
    
    // Embed arrays of items and the report directly
    items: [InvoiceItemSchema], 
    risk_report: RiskReportSchema,
    total_co2_kg: Number
});

module.exports = mongoose.model('Invoice', InvoiceSchema);