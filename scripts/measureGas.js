const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer, user, verifier] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("IdentityCostModel");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed");

  let csv = "operation,case,processed_bytes,gasUsed\n";

  // ---------- Upload phase (one-time identity registration) ----------
  const fullIdentityProfile = "full-identity-profile";

  const commitment = ethers.keccak256(
    ethers.toUtf8Bytes(fullIdentityProfile)
  );

  const uploadTx = await contract.connect(user).upload(commitment);
  const uploadReceipt = await uploadTx.wait();

  console.log("Upload gasUsed:", uploadReceipt.gasUsed.toString());

  csv += `upload,full_identity_commitment,32,${uploadReceipt.gasUsed}\n`;

  // ---------- Verification phase (partial identity disclosure) ----------
  const verificationScenarios = [
    { name: "age_check", bytes: 1 },
    { name: "age_plus_nationality", bytes: 9 },
    { name: "border_control", bytes: 24 },
    { name: "university_access", bytes: 64 },
    { name: "full_kyc", bytes: 141 }
  ];

  for (const s of verificationScenarios) {
    const tx = await contract
      .connect(verifier)
      .verify(user.address, s.bytes);

    const receipt = await tx.wait();
    console.log(`Verify (${s.name}) gasUsed:`, receipt.gasUsed.toString());

    csv += `verify,${s.name},${s.bytes},${receipt.gasUsed}\n`;
  }

  fs.writeFileSync("results/gas_results.csv", csv);
  console.log("Results saved to results/gas_results.csv");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
