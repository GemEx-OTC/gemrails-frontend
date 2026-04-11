/**
 * Formats an array of objects as a CSV string and triggers a browser download
 */
export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return

  // Extract headers from the first object
  const headers = Object.keys(data[0])
  
  // Create CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...data.map(row => 
      headers.map(header => {
        const val = row[header]
        // Handle values that might contain commas
        const escaped = ('' + val).replace(/"/g, '""')
        return `"${escaped}"`
      }).join(",")
    )
  ]

  const csvString = csvRows.join("\n")
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Maps transaction data to a flatter structure for CSV export
 */
export const formatTransactionsForExport = (transactions: any[]) => {
  return transactions.map(tx => ({
    "Date": new Date(tx.timestamp || tx.createdAt).toLocaleString(),
    "Reference": tx.transactionId || tx.id,
    "Amount (NGN)": tx.amount,
    "Bonus (NGN)": tx.incentive || tx.merchantIncentive || 0,
    "Total (NGN)": (tx.amount || 0) + (tx.incentive || tx.merchantIncentive || 0),
    "Crypto Amount": tx.cryptoAmount,
    "Crypto Asset": tx.cryptoAsset,
    "Network": tx.network,
    "Status": tx.status,
    "Customer Ref": tx.customerRef || "",
    "Bank": tx.payoutAccount?.bankName || "",
    "Account Number": tx.payoutAccount?.accountNumber || "",
  }))
}
