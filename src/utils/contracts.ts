import { getContract } from "thirdweb";
import { USERS_DIRECTORY_ADDRESS, PROCESS_MANAGEMENT_ADDRESS, CHAIN, client } from "./constants";

export const mainContract = getContract({
  client,
  chain: CHAIN,
  address: PROCESS_MANAGEMENT_ADDRESS,
  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "assigned",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "multisignContract",
          "type": "address"
        }
      ],
      "name": "AssignmentCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "process",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "associationName",
          "type": "string"
        }
      ],
      "name": "AssociatedProcessAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "process",
          "type": "address"
        }
      ],
      "name": "AssociatedProcessRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "documentProcess",
          "type": "address"
        }
      ],
      "name": "DocumentProcessCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "program",
          "type": "string"
        }
      ],
      "name": "ProgramAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "ProgramDeleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "program",
          "type": "string"
        }
      ],
      "name": "ProgramUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "processContract",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "phase",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "multisignContract",
          "type": "address"
        }
      ],
      "name": "multisignAssignment",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "_associationType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "_associationName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_processAddress",
          "type": "address"
        }
      ],
      "name": "addAssociatedProcess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_processAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_multisignAddress",
          "type": "address"
        }
      ],
      "name": "addEvaluatorToPending",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "program",
          "type": "string"
        }
      ],
      "name": "addProgram",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_owners",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_processAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numConfirmationsRequired",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_state",
          "type": "string"
        }
      ],
      "name": "createAssignment",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_processName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_initialState",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_contractProcessId",
          "type": "string"
        },
        {
          "internalType": "address[]",
          "name": "_students",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "_director",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "_codirector",
          "type": "address[]"
        }
      ],
      "name": "createDocumentProcess",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "deleteProgram",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllPrograms",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "_associationType",
          "type": "uint8"
        }
      ],
      "name": "getAssociatedProcesses",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "process",
          "type": "address"
        }
      ],
      "name": "getPendingEvaluations",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "getProgram",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "_associationType",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_processAddress",
          "type": "address"
        }
      ],
      "name": "removeAssociatedProcess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_contract",
          "type": "address"
        }
      ],
      "name": "removeEvaluatorFromPending",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "program",
          "type": "string"
        }
      ],
      "name": "updateProgram",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
});

export const usersContract = getContract({
  client,
  chain: CHAIN,
  address: USERS_DIRECTORY_ADDRESS,
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "name": "UserAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        }
      ],
      "name": "UserDeleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "UserNameChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "role",
          "type": "string"
        }
      ],
      "name": "UserRoleChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_email",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_role",
          "type": "string"
        }
      ],
      "name": "addUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "deleteUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_walletAddress",
          "type": "address"
        }
      ],
      "name": "getFullUser",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_email",
          "type": "string"
        }
      ],
      "name": "getUserByEmail",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_walletAddress",
          "type": "address"
        }
      ],
      "name": "getUserByWallet",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "setUserName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_role",
          "type": "string"
        }
      ],
      "name": "setUserRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
});

export const getDocumentContract = (address: string) => {
  return getContract({
    client,
    chain: CHAIN,
    address,
    abi: [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_processName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_initialState",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_contractProcessId",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "_mainContract",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "_students",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_director",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_codirector",
            "type": "address[]"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "participant",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "name": "ParticipantAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "processName",
            "type": "string"
          }
        ],
        "name": "ProcessNameChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "state",
            "type": "string"
          }
        ],
        "name": "StateChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "phase",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "state",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "associatedLink",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "comments",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "date",
            "type": "string"
          }
        ],
        "name": "TransactionAdded",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_participant",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "_associationType",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "_associationName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "_mainContract",
            "type": "address"
          }
        ],
        "name": "addParticipantAssociated",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_phase",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_state",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_associatedLink",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_comments",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_date",
            "type": "string"
          }
        ],
        "name": "addTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllParticipantAddresses",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getContractProcessId",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getContractState",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_participant",
            "type": "address"
          }
        ],
        "name": "getParticipant",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getProcessName",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "getTransaction",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getTransactionCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "_students",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_director",
            "type": "address[]"
          },
          {
            "internalType": "address[]",
            "name": "_codirector",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "_mainContract",
            "type": "address"
          }
        ],
        "name": "initializeParticipants",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_newState",
            "type": "string"
          }
        ],
        "name": "setContractState",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_newProcessName",
            "type": "string"
          }
        ],
        "name": "setProcessName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "transactions",
        "outputs": [
          {
            "internalType": "string",
            "name": "phase",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "state",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "associatedLink",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "comments",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "date",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
  });
};

export const getMultisignContract = (address: string) => {
  return getContract({
    client,
    chain: CHAIN,
    address,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_mainContract",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_contract",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "_owners",
            "type": "address[]"
          },
          {
            "internalType": "uint256",
            "name": "_numConfirmationsRequired",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_phase",
            "type": "string"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "Confirmation",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "newPhase",
            "type": "string"
          }
        ],
        "name": "callChangePhase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "newPhase",
            "type": "string"
          }
        ],
        "name": "confirmTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllSigners",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "isConfirmed",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "isOwner",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "numConfirmationsRequired",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "phase",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          }
        ],
        "name": "setTargetContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "targetContract",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
  });
};