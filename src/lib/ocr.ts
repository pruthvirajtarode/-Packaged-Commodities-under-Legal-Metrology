import Tesseract from 'tesseract.js';

export interface ExtractedFieldData {
  fieldKey: string;
  value: string;
  confidence: number;
}

export async function performOCR(imageSource: string | File): Promise<ExtractedFieldData[]> {
  try {
    const result = await Tesseract.recognize(
      imageSource,
      'eng',
      {
        logger: m => console.log(m),
      }
    );

    const text = result.data.text;
    const confidence = result.data.confidence;

    // A deterministic extraction logic for Demo Mode without OpenAI API keys.
    // In production, this text would be sent to an LLM for structured extraction.
    return extractFieldsFromText(text, confidence);
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
}

function extractFieldsFromText(text: string, baseConfidence: number): ExtractedFieldData[] {
  const fields: ExtractedFieldData[] = [];
  const lines = text.split('\n').map(l => l.trim().toLowerCase());
  
  // Extract MRP
  const mrpMatch = text.match(/(?:mrp|m\.r\.p|price|rs|₹)[\s\.:]*([0-9]+(?:\.[0-9]+)?)/i);
  if (mrpMatch) {
    fields.push({
      fieldKey: 'mrp',
      value: `₹${mrpMatch[1]}`,
      confidence: Math.min(baseConfidence + 5, 99)
    });
  }

  // Extract Net Quantity
  const netQtyMatch = text.match(/(?:net qty|net quantity|net wt|weight)[\s\.:]*([0-9]+\s*(?:kg|g|ml|l))/i);
  if (netQtyMatch) {
    fields.push({
      fieldKey: 'netQuantity',
      value: netQtyMatch[1],
      confidence: Math.min(baseConfidence + 3, 98)
    });
  }

  // Extract Manufacturer
  const mfgLineIndex = lines.findIndex(l => l.includes('manufactured') || l.includes('packed by') || l.includes('mfd by'));
  if (mfgLineIndex !== -1 && lines[mfgLineIndex + 1]) {
    fields.push({
      fieldKey: 'manufacturer',
      value: text.split('\n')[mfgLineIndex + 1].trim(), // Return the original case
      confidence: Math.max(baseConfidence - 10, 60)
    });
  }

  // Extract Customer Care
  const careMatch = text.match(/(?:care|complaints|feedback|email|call)[\s\.:]*(.*?(?:\.com|[0-9]{10}))/i);
  if (careMatch) {
    fields.push({
      fieldKey: 'customerCare',
      value: careMatch[1],
      confidence: Math.max(baseConfidence - 5, 70)
    });
  }

  return fields;
}
