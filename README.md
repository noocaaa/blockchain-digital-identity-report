# Blockchain Identity Cost Analysis

This repository accompanies the technical report: **Privacy-Preserving Blockchain-Based Digital Identity**.

## Overview
This project provides an illustrative cost analysis of blockchain-based digital identity operations. It measures the gas cost of identity upload and verification using Ethereum-compatible execution in order to explore how reducing the amount of disclosed identity information impacts transaction cost.

The implementation is a proof-of-concept measurement tool that supports the analytical discussion presented in the report.

## Methodology
- Solidity smart contracts are executed on a local Ethereum Virtual Machine using Hardhat
- Gas consumption (`gasUsed`) is obtained from transaction receipts
- Monetary cost is estimated by combining gas usage with gas price data retrieved from the local provider
- No real ETH is required to reproduce the experiments

## Operations Measured
- **Upload phase**: anchoring identity commitments on-chain (storage write)
- **Verification phase**: recording verification events under different disclosure scenarios

## Reproducibility
All experiments can be reproduced locally using the following commands:

```bash
npm install
npx hardhat run scripts/measureGas.js
```
The ``hardhat-toolbox`` package is required to reproduce the execution environment.

## Cost Calculation (costCalc)

In addition to measuring raw gas consumption, the repository includes a cost calculation step (costCalc) that converts gas usage into estimated monetary cost in ETH.

This step is implemented as a separate Node.js script and performs the following actions:

- Reads gas usage data from results/gas_results.csv
- Retrieves gas price information from the local Ethereum provider
- Computes the estimated cost for each operation
- Outputs the results to results/cost_results_eth.csv

The cost calculation is intended to support relative comparison between different disclosure strategies, rather than to provide precise mainnet pricing.

To run the cost calculation step:
````bash
node scripts/costCalc.js
````

Notes

- The experimental setup is deliberately simplified to isolate the relationship between disclosure size and verification cost
- Absolute cost values should be interpreted as indicative
- The focus of the project is on design insight and cost-aware identity verification rather than benchmarking cryptographic protocols