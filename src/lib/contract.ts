export const PAYROLL_ADDRESS = "0xDecf2FE5cF876C2D5d046F15484cA05d87A6FF05" as const;

export const PAYROLL_ABI = [
  {
    type: "function",
    name: "addEmployee",
    inputs: [
      { name: "wallet", type: "address" },
      { name: "amountCommitment", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "employeeCount",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "employees",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "wallet", type: "address" },
      { name: "amountCommitment", type: "bytes32" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "payEmployee",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "secret", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ type: "address" }],
    stateMutability: "view",
  },
] as const;
