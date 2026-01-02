const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const gasFile = path.join("results", "gas_results.csv");
  const outFile = path.join("results", "cost_results_eth.csv");

  if (!fs.existsSync(gasFile)) {
    console.error("Missing gas_results.csv");
    process.exit(1);
  }

  // ---------- Gas price (EIP-1559, local provider) ----------
  const provider = ethers.provider;
  const feeData = await provider.getFeeData();
  const gasPriceWei = feeData.gasPrice ?? feeData.maxFeePerGas;
  const gasPriceGwei = Number(gasPriceWei.toString()) / 1e9;

  const timestamp = new Date().toISOString();

  console.log("Gas price (gwei):", gasPriceGwei.toFixed(2));
  console.log("Timestamp:", timestamp);

  // ---------- Read gas results ----------
  const lines = fs.readFileSync(gasFile, "utf8").trim().split(/\r?\n/);
  const header = lines[0].split(",");
  const rows = lines.slice(1).map((l) => {
    const cols = l.split(",");
    const obj = {};
    header.forEach((h, i) => (obj[h] = cols[i]));
    return obj;
  });

  // ---------- Compute ETH cost ----------
  const out = [];
  out.push([
    "timestamp",
    "gas_price_gwei",
    "operation",
    "case",
    "processed_bytes",
    "gasUsed",
    "cost_eth"
  ].join(","));

  for (const r of rows) {
    const gasUsed = Number(r.gasUsed);
    const costEth = gasUsed * gasPriceGwei * 1e-9;

    out.push([
      timestamp,
      gasPriceGwei.toFixed(2),
      r.operation,
      r.case,
      r.processed_bytes,
      gasUsed,
      costEth.toFixed(10)
    ].join(","));
  }

  fs.writeFileSync(outFile, out.join("\n"));
  console.log("Saved:", outFile);
}

main().catch(console.error);
