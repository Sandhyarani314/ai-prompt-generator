import Papa from 'papaparse';

/**
 * Parses raw CSV string or File into JSON rows and headers
 */
export const parseCSVData = (fileOrContent) => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileOrContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(results.errors[0].message || "Failed to parse CSV file."));
        } else {
          const headers = results.meta.fields || [];
          const rows = results.data;
          const detectedPromptCol = detectPromptColumn(headers);
          
          resolve({
            headers,
            rows,
            detectedPromptCol,
            stats: calculateDatasetStats(rows, detectedPromptCol)
          });
        }
      },
      error: (err) => reject(err)
    });
  });
};

/**
 * Automatically detects the main column containing prompt strings
 */
export const detectPromptColumn = (headers) => {
  if (!headers || headers.length === 0) return "";
  
  const keywords = ["prompt", "text", "instruction", "description", "body", "content", "query", "template", "message"];
  
  for (const kw of keywords) {
    const found = headers.find(h => h.toLowerCase().includes(kw));
    if (found) return found;
  }
  
  return headers[0]; // fallback to first header
};

/**
 * Calculates dataset stats: totals, unique count, missing values, duplicates, avg length
 */
export const calculateDatasetStats = (rows, promptCol) => {
  if (!rows || rows.length === 0) {
    return {
      totalPrompts: 0,
      uniquePrompts: 0,
      domainsCount: 0,
      missingValues: 0,
      duplicateRecords: 0,
      avgPromptLength: 0
    };
  }

  const promptValues = rows.map(r => (r[promptCol] ? String(r[promptCol]).trim() : ""));
  const nonMissing = promptValues.filter(p => p.length > 0);
  const missingCount = promptValues.length - nonMissing.length;
  
  const uniqueSet = new Set(nonMissing.map(p => p.toLowerCase()));
  const duplicateCount = nonMissing.length - uniqueSet.size;

  const totalChars = nonMissing.reduce((acc, curr) => acc + curr.length, 0);
  const avgLen = nonMissing.length > 0 ? Math.round(totalChars / nonMissing.length) : 0;

  // Domain detection
  const domainCol = rows[0] ? Object.keys(rows[0]).find(k => k.toLowerCase().includes("domain") || k.toLowerCase().includes("category")) : null;
  const domains = new Set();
  if (domainCol) {
    rows.forEach(r => {
      if (r[domainCol]) domains.add(String(r[domainCol]).trim());
    });
  }

  return {
    totalPrompts: rows.length,
    uniquePrompts: uniqueSet.size,
    domainsCount: domains.size > 0 ? domains.size : 1,
    missingValues: missingCount,
    duplicateRecords: duplicateCount,
    avgPromptLength: avgLen
  };
};

/**
 * Data Cleaning Utilities
 */
export const cleanDataset = (rows, promptCol, options = {}) => {
  if (!rows) return [];
  let cleaned = [...rows];

  if (options.cleanSpaces) {
    cleaned = cleaned.map(r => ({
      ...r,
      [promptCol]: r[promptCol] ? String(r[promptCol]).replace(/\s+/g, ' ').trim() : ''
    }));
  }

  if (options.removeMissing) {
    cleaned = cleaned.filter(r => r[promptCol] && String(r[promptCol]).trim().length > 0);
  }

  if (options.removeDuplicates) {
    const seen = new Set();
    cleaned = cleaned.filter(r => {
      const val = r[promptCol] ? String(r[promptCol]).toLowerCase().trim() : '';
      if (!val || seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }

  if (options.normalizeText) {
    cleaned = cleaned.map(r => ({
      ...r,
      [promptCol]: r[promptCol] ? String(r[promptCol]).toLowerCase().replace(/[^a-zA-Z0-9\s.,?!]/g, '') : ''
    }));
  }

  return cleaned;
};
