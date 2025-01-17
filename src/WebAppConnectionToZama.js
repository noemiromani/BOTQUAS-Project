import { React, useEffect, useRef, useState } from "react";

//Chnage #1
import {initFhevm} from "fhevmjs";
import { createInstance } from "fhevmjs/web";

import {Contract, BrowserProvider, getAddress } from 'ethers';
//import {ethers} from "ethers";
import BigNumber from "bignumber.js";
import {Buffer} from "buffer";

//import { createInstances } from "../instance";
//import { getSigners, initSigners } from "../signers";
//import { BigNumber } from "./node_modules/bignumber.js/bignumber.mjs";



function WebAppConnectionToZama (props){
    const [instance, setInstance] = useState();
    const [supplier_id, setSupplierId] = useState(1);
    const [provider, setProvider] = useState();
    const [account, setAccount]=useState();
    const [contract, setContract]=useState(null);
    //const [encryptedSEI, setEncryptedSei] = useState();
    const [keyS, setKeyS] = useState([]);
    const [eip712, setEip712] = useState();
    const [signature, setSignature] = useState();
    //const[privateKey, setPrivateKey]=useState();
    const[publicKey, setPublicKey]= useState();
    const[privateKey, setPrivateKey] =useState();
    const [userBalance, setUserBalance]= useState();
    const [encrypted_balance_ToDispaly,setEncryptedUserBalanceToDisplay]= useState();
    //const [accounts, setAccounts] = useState([]);
    
    //const accounts = useRef(null);
    //const [contract, setContract] = useState();
    //const [contractAddress,setContractAddress] = useState();
    //const [ABI, setAbi]= useState();
    const [encryptedSEI, setEncryptedSei] = useState();
    const[encryptedSei_toDisplay, setEncryptedSei_toDisplay]=useState();
    const [decryptedSEI, setDecryptedSEI] = useState();
    const [decryptedSei_toDisplay, setDecryptedSei_toDisplay]=useState();
    const [greeting, setGreeting] = useState();
    const [params, setParams] = useState([]);
    //"https://devnet.zama.ai/"
    //"http://localhost:7077/"
    //"https://gateway.zama.ai/" ,
    //"https://devnet.zama.ai/"
    //"https://gateway.zama.ai/"
    //https://gateway.devnet.zama.ai/"
    //"https://gateway.sepolia.zama.ai/",
    useEffect(() => {
        if (window.ethereum){
        initFhevm().then(async () => {
            const _instance= await createInstance({
                // Change #2, #3, #4
                chainId: 11155111, // Sepolia chain ID
                kmsContractAddress: "0x9D6891A6240D6130c54ae243d8005063D05fE14b",
                aclContractAddress: "0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5",
                network: window.ethereum,
                //networkUrl: "https://eth-sepolia.public.blastapi.io",
                gatewayUrl: "https://gateway.sepolia.zama.ai/",
                
            });
            setInstance(_instance);
            console.log(_instance);
        });
        } else {
            alert("Non-ethereum browser detected. Install Metamask and try again");
        }
        // check if ethereum object exists on window
        //if (window.ethereum) {
            /*const _instance = async () => {
                await createInstance({
                chainId: 9000,
                networkUrl: "https://devnet.zama.ai",
                gatewayUrl: "https://gateway.zama.ai",
              });
            }
            setInstance(_instance);
        //} else {
            //alert("Non-ethereum browser detected. Install Metamask and try again");
        //}*/

        return () => {};
    }, []);

    const connectWallet = async() => {
        if (instance) {
          try {
            const provider = new BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
          } catch (e) {
            console.error(
              "Error occured while requesting accounts. See details: ",
              e
            );
          }
        }
    };

    const getGreeting = async () => {
        const provider = new BrowserProvider(window.ethereum);
        const contractAddress1 = "0xe5E6E26CfFF454741Ab2C6a23804F0C03c811fd0";
        const abi1 = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "InvalidShortString",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "str",
                        "type": "string"
                    }
                ],
                "name": "StringTooLong",
                "type": "error"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "EIP712DomainChanged",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "setEamount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_greeting",
                        "type": "string"
                    }
                ],
                "name": "setGreeting",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "eip712Domain",
                "outputs": [
                    {
                        "internalType": "bytes1",
                        "name": "fields",
                        "type": "bytes1"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "version",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "chainId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "verifyingContract",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "salt",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "extensions",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getBalance",
                "outputs": [
                    {
                        "internalType": "euint32",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getGreeting",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        const contract1 = new Contract(contractAddress1, abi1, provider.getSigner()).connect(provider);
        const greeting_ = await contract1.getGreeting();
        setGreeting(greeting_);

    }


    // ERROR DISPLAYED se considero il setUserBalance: "You must provide the ACL address at Object.reencrypt " at userBalance_ (errore displayed con tutti e gli indirizzi usati per 'gatewayURL' nell'instance)
    // --> come in getBalance
    // NESSUN ERROR displayed commentando il setUserBalance: Click e non succede nulla
    // --> il problema dovrebbe risiedere nel setUserBalance
    const getBalance = async () => {
        const provider = new BrowserProvider(window.ethereum);
        //DEVO RI-COMPILARE E RI-DEPLOYARE perchè ho sbagliato a copiare l'abi
        const abiConAcl = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "InvalidShortString",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "str",
                        "type": "string"
                    }
                ],
                "name": "StringTooLong",
                "type": "error"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "EIP712DomainChanged",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "setEamount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_greeting",
                        "type": "string"
                    }
                ],
                "name": "setGreeting",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "eip712Domain",
                "outputs": [
                    {
                        "internalType": "bytes1",
                        "name": "fields",
                        "type": "bytes1"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "version",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "chainId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "verifyingContract",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "salt",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "extensions",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getBalance",
                "outputs": [
                    {
                        "internalType": "euint32",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getGreeting",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        //const address2= "0xA4CBAd3408F47c9860b3Ee43A1Cba0e668493FFc";
        const addressConAcl = "0xe5E6E26CfFF454741Ab2C6a23804F0C03c811fd0";
        const { publicKey_, privateKey_ } = instance.generateKeypair();

        // Create an EIP712 object for the user to sign.
        const eip712_ = instance.createEIP712(publicKey_, addressConAcl);

        // Request the user's signature on the public key
        const params_ = [account, JSON.stringify(eip712_)];
        
        
        const signature_ =//await window.ethereum.request({ method: "eth_signTypedData_v4", params_ });
        () => { provider
        .sendAsync(
            {
                method: "eth_signTypedData_v4",
                params: params_,
                from: account,
            },
            function (err,result){
                if (err) return console.dir(err)
                if (result.error) {
                    alert(result.error.message)
                }
                if (result.error) return console.error("ERROR", result)
                console.log("TYPED SIGNED:" + JSON.stringify(result.result))
            }
        )
        }
        
        const contract2 = new Contract(addressConAcl, abiConAcl, provider.getSigner()).connect(provider);
        const encrypted_balance_ToDispaly = BigNumber(await contract2.getBalance()).toString();
        setEncryptedUserBalanceToDisplay(encrypted_balance_ToDispaly);

        const encrypted_balance_ = await contract2.getBalance();
        //setEncryptedBalance(encrypted_balance_);

        const userBalance_ = () => {
            instance.reencrypt(encrypted_balance_,privateKey_, publicKey_, signature_, addressConAcl, account);
            
        }
        //console.log(userBalance_);
        setUserBalance(userBalance_);
    }



    /*const getEncryptedsei = async () => {
        const provider = new BrowserProvider(window.ethereum);
        
        const contractAddress = "0xcbFF274870ff5ae114c0CE7F48399233D3C30764";
        const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dataset_id",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "_batchid",
				"type": "uint32"
			},
			{
				"internalType": "string[]",
				"name": "identifiers",
				"type": "string[]"
			},
			{
				"internalType": "uint32[]",
				"name": "values",
				"type": "uint32[]"
			}
		],
		"name": "addDataset_CirculateEnvironmentalSustainability",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dataset_id",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "identifiers",
				"type": "string[]"
			},
			{
				"internalType": "uint32[]",
				"name": "values",
				"type": "uint32[]"
			}
		],
		"name": "addDataset_SocialEconomicSustainability",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "supplier_id",
				"type": "uint256"
			}
		],
		"name": "addSupplier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "dataset_id",
				"type": "uint256"
			}
		],
		"name": "DatasetRemoved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "allowed",
				"type": "address"
			}
		],
		"name": "grantAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dataset_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "identifier",
				"type": "string"
			},
			{
				"internalType": "uint32",
				"name": "value",
				"type": "uint32"
			}
		],
		"name": "modifyDataset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "dataset_id",
				"type": "uint256"
			}
		],
		"name": "NewDatasetUploaded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "supplier_id",
				"type": "uint256"
			}
		],
		"name": "NewSupplier",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dataset_id",
				"type": "uint256"
			}
		],
		"name": "removeDataset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "allowed",
				"type": "address"
			}
		],
		"name": "revokeAccess",
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
		"name": "_datasets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "supplier_id",
				"type": "uint256"
			},
			{
				"internalType": "euint32",
				"name": "batch_id",
				"type": "uint256"
			},
			{
				"internalType": "euint32",
				"name": "CEI_score",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
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
		"name": "addresses",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "datasets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "supplier_id",
				"type": "uint256"
			},
			{
				"internalType": "euint32",
				"name": "SEI_score",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dataset_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "getIdentifiers",
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
				"name": "dataset_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "a",
				"type": "string"
			}
		],
		"name": "getMappingValues",
		"outputs": [
			{
				"internalType": "euint32",
				"name": "return_value",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dataset_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "getNumericValues",
		"outputs": [
			{
				"internalType": "euint32",
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
				"internalType": "uint256",
				"name": "supplier_id",
				"type": "uint256"
			}
		],
		"name": "getSEI",
		"outputs": [
			{
				"internalType": "euint32",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "is_allowed",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "is_Dataset",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "is_Supplier",
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
		"name": "suppliers",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Suppliers",
		"outputs": [
			{
				"internalType": "euint32",
				"name": "SEI_index",
				"type": "uint256"
			},
			{
				"internalType": "euint32",
				"name": "CEI_index",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
        ]
        const contract= new Contract(contractAddress, abi, provider.getSigner()).connect(provider);
        
        const encryptedSEI_ = await contract.getSEI(supplier_id);
        const encryptedSEI_toDisplay_ = BigNumber(await contract.getSEI(supplier_id)).toString();
        setEncryptedSei(encryptedSEI_);
        setEncryptedSei_toDisplay(encryptedSEI_toDisplay_);
    }*/

    
    // ERROR DISPLAYED se considero il setEncryptedSEI: "You must provide the ACL address at Object.reencrypt " at decrypted_SEI_ (errore displayed con tutti e gli indirizzi usati per 'gatewayURL' nell'instance)
    // --> come in getBalance
    // NESSUN ERROR displayed commentando il setEncryptedSEI: Click e non succede nulla
    // --> il problema dovrebbe risiedere nel setEncryptedSEI
    const getDecryptedsei = async () => {
        window.Buffer = Buffer;
        const provider = new BrowserProvider(window.ethereum);
        //const account_ = "0xE518AfAc620D26749A0fBC46C08A8D4c14233beC";
        const account_ = "0x31cD18c5460A73Fa8B2E549D40066f490c63Dad4";
        //FHEVM 0.6, CNontract address Deployed
        //const contractAddressNew = "0xdD9858AC04028CaD8eC41782FF56b611330c099C";
        const addressWithGateway = "0x3376Ed6Ac2AF1F268E27154DA7a7f01430980C94";
        //const contractAddress = "0x0327719b1CDB97FC5E2aB514beDf51a50FaEb18D";
        
        const {publicKey: publicKey_, privateKey: privateKey_} = instance.generateKeypair();
        const eip712_ = instance.createEIP712(publicKey_, addressWithGateway);
        const params_ = [account_, JSON.stringify(eip712_)];
        const signature_ = await window.ethereum.request({ method: "eth_signTypedData_v4", params: params_ });

        // --> STO RICHIEDENDO IL VALORE CIFRATO DIRETTAMENTE QUI DENTRO
        /*const abi = [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "_batchid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "string[]",
                        "name": "identifiers",
                        "type": "string[]"
                    },
                    {
                        "internalType": "uint32[]",
                        "name": "values",
                        "type": "uint32[]"
                    }
                ],
                "name": "addDataset_CirculateEnvironmentalSustainability",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string[]",
                        "name": "identifiers",
                        "type": "string[]"
                    },
                    {
                        "internalType": "uint32[]",
                        "name": "values",
                        "type": "uint32[]"
                    }
                ],
                "name": "addDataset_SocialEconomicSustainability",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "addSupplier",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    }
                ],
                "name": "DatasetRemoved",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "allowed",
                        "type": "address"
                    }
                ],
                "name": "grantAccess",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    }
                ],
                "name": "NewDatasetUploaded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "wallet",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "NewSupplier",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "allowed",
                        "type": "address"
                    }
                ],
                "name": "revokeAccess",
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
                "name": "_datasets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "batch_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "CEI_score",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
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
                "name": "datasets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "SEI_score",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "i",
                        "type": "uint256"
                    }
                ],
                "name": "getNumericValues",
                "outputs": [
                    {
                        "internalType": "euint32",
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
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "getSEI",
                "outputs": [
                    {
                        "internalType": "euint32",
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
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "Suppliers",
                "outputs": [
                    {
                        "internalType": "euint32",
                        "name": "SEI_index",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "CEI_index",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]*/

        //FHEVM 0.6, Contract ABI Deployed
        /*const ABInew= [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    }
                ],
                "name": "DatasetRemoved",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    }
                ],
                "name": "NewDatasetUploaded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "wallet",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "NewSupplier",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "Suppliers",
                "outputs": [
                    {
                        "internalType": "euint32",
                        "name": "SEI_index",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "CEI_index",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
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
                "name": "_datasets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "batch_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "CEI_score",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "_batchid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "string[]",
                        "name": "identifiers",
                        "type": "string[]"
                    },
                    {
                        "internalType": "uint32[]",
                        "name": "values",
                        "type": "uint32[]"
                    }
                ],
                "name": "addDataset_CirculateEnvironmentalSustainability",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string[]",
                        "name": "identifiers",
                        "type": "string[]"
                    },
                    {
                        "internalType": "einput[]",
                        "name": "values",
                        "type": "bytes32[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "inputProof",
                        "type": "bytes"
                    }
                ],
                "name": "addDataset_SocialEconomicSustainability",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "addSupplier",
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
                "name": "datasets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "SEI_score",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "i",
                        "type": "uint256"
                    }
                ],
                "name": "getNumericValues",
                "outputs": [
                    {
                        "internalType": "euint32",
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
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "getSEI",
                "outputs": [
                    {
                        "internalType": "euint32",
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
                        "internalType": "address",
                        "name": "allowed",
                        "type": "address"
                    }
                ],
                "name": "grantAccess",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "allowed",
                        "type": "address"
                    }
                ],
                "name": "revokeAccess",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]*/

        const ABIwithGateway = [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "_batchid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "string[]",
                        "name": "identifiers",
                        "type": "string[]"
                    },
                    {
                        "internalType": "uint32[]",
                        "name": "values",
                        "type": "uint32[]"
                    }
                ],
                "name": "addDataset_CirculateEnvironmentalSustainability",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string[]",
                        "name": "identifiers",
                        "type": "string[]"
                    },
                    {
                        "internalType": "einput[]",
                        "name": "values",
                        "type": "bytes32[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "inputProof",
                        "type": "bytes"
                    }
                ],
                "name": "addDataset_SocialEconomicSustainability",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "addSupplier",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    }
                ],
                "name": "DatasetRemoved",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "allowed",
                        "type": "address"
                    }
                ],
                "name": "grantAccess",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    }
                ],
                "name": "NewDatasetUploaded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "wallet",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "NewSupplier",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "allowed",
                        "type": "address"
                    }
                ],
                "name": "revokeAccess",
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
                "name": "_datasets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "batch_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "CEI_score",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
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
                "name": "datasets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "SEI_score",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "i",
                        "type": "uint256"
                    }
                ],
                "name": "getNumericValues",
                "outputs": [
                    {
                        "internalType": "euint32",
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
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "getSEI",
                "outputs": [
                    {
                        "internalType": "euint32",
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
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "Suppliers",
                "outputs": [
                    {
                        "internalType": "euint32",
                        "name": "SEI_index",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "CEI_index",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        //const contract= new Contract(contractAddress, abi, provider.getSigner()).connect(provider);
        //const contract= new Contract(contractAddress, abi, account_).connect(provider);
        const contract= new Contract(addressWithGateway, ABIwithGateway, provider);
        
        const encryptedSEI_ = await contract.getSEI(supplier_id);
        console.log("Encrypted SEI retrieved!: " + encryptedSEI_);
        console.log(encryptedSEI_, privateKey_,publicKey_, signature_,addressWithGateway, account_); 

        const decrypted_SEI_ = await instance.reencrypt(encryptedSEI_, privateKey_,publicKey_, signature_, addressWithGateway, account_);
        console.log(decrypted_SEI_); 
        //console.log(BigNumber(decrypted_SEI_).toString());
        //setDecryptedSEI(decrypted_SEI_);    
    };

    const setInputSupplier_ID = (e) => {
        setSupplierId(e.target.value);
    }

    const onClick= async () => {
        //await initSigners(); // Initialize signers
        //const signers = await getSigners();
        //const instance = await createInstances(this.signers);
        window.Buffer = Buffer;
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = "0x4532f9fd7eaeA9CC170f044C001eb0697e956f85";
        //0x3376Ed6Ac2AF1F268E27154DA7a7f01430980C94
        const ABI = [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string[]",
                        "name": "identifiers",
                        "type": "string[]"
                    },
                    {
                        "internalType": "einput[]",
                        "name": "values",
                        "type": "bytes32[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "inputProof",
                        "type": "bytes"
                    }
                ],
                "name": "addDataset_SocialEconomicSustainability",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "addSupplier",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    }
                ],
                "name": "DatasetRemoved",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "allowed",
                        "type": "address"
                    }
                ],
                "name": "grantAccess",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    }
                ],
                "name": "NewDatasetUploaded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "wallet",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "NewSupplier",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "allowed",
                        "type": "address"
                    }
                ],
                "name": "revokeAccess",
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
                "name": "_datasets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "batch_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "CEI_score",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
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
                "name": "addresses",
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
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "datasets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "SEI_score",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "i",
                        "type": "uint256"
                    }
                ],
                "name": "getIdentifiers",
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
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "a",
                        "type": "string"
                    }
                ],
                "name": "getMappingValues",
                "outputs": [
                    {
                        "internalType": "euint32",
                        "name": "return_value",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "dataset_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "i",
                        "type": "uint256"
                    }
                ],
                "name": "getNumericValues",
                "outputs": [
                    {
                        "internalType": "euint32",
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
                        "internalType": "uint256",
                        "name": "supplier_id",
                        "type": "uint256"
                    }
                ],
                "name": "getSEI",
                "outputs": [
                    {
                        "internalType": "euint32",
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
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "is_allowed",
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
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "is_Dataset",
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
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "is_Supplier",
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
                "name": "suppliers",
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
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "Suppliers",
                "outputs": [
                    {
                        "internalType": "euint32",
                        "name": "SEI_index",
                        "type": "uint256"
                    },
                    {
                        "internalType": "euint32",
                        "name": "CEI_index",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        const contract1 = new Contract(address,ABI, signer);
        const account_ = "0x31cD18c5460A73Fa8B2E549D40066f490c63Dad4";
        //const account_ = "0xE518AfAc620D26749A0fBC46C08A8D4c14233beC";
        console.log(contract1);

        // Create encrypted inputs
        const input = instance.createEncryptedInput(address, signer); //_account invece che signer
        const inputs = input.add32(1500).add32(5).encrypt(); // Encrypt the parameters
        console.log("Encryption of Inputs: OK" + inputs.handles[0] + inputs.handles[1]);
        
        const identifiers = ["average salary", "employees"];
        const values = [inputs.handles[0], inputs.handles[1]];
        const tx = await contract1.addDataset_SocialEconomicSustainability(
            //"0xE518AfAc620D26749A0fBC46C08A8D4c14233beC", //Account address
            1,
            identifiers,
            values,
            inputs.inputProof, // Proof to validate all encrypted inputs
        );
        tx.wait();
        console.log("Storage of Encrypted Inputs - Dataset added to the SC: OK" + tx + values + identifiers);
    }

    return (
    <div className="row">
        <form className="form-inline" >
        <div className="form-group">
          <div className = "row">
          <h4> Get Dataset's Values </h4>
          </div>
          <div className="row">
            <label> Supplier ID </label>
            <input className ="App input" type="text" name="supplier_id" value = {supplier_id} onChange={setInputSupplier_ID} />
            </div>
            <div className='row'>
                <button class="btn-outline-light" onClick={getDecryptedsei}> OK</button>  
            </div>
            <p> You do NOT have the permission to access that Dataset! </p>
            </div>
            </form>
            
           
                
        
            {instance != null ?
            <p> Instance Created!</p> : <p>NO instance</p>}

            {account &&
            <p> Account: {account}</p>}
 
            <button onClick={connectWallet}> Connect Your Wallet</button>
            <button onClick={onClick}>Send Dataset's data</button>
            
           
            <button onClick={getGreeting}> Get greeting</button>
            <button onClick={getBalance}> Decrypted Balance</button>
            <p> Current greeting: {greeting} </p>

            {encrypted_balance_ToDispaly != null ?
            <p>Now, User balance Encrypted, number format: {encrypted_balance_ToDispaly}</p> : <p> No result for encrypted Balance</p>}

            {userBalance != null ?
            <p> Decrypted User Balance: {userBalance}</p> : <p> No result for reencryption </p>}

            {encryptedSei_toDisplay != null  ?
            <p> Current ENCRYPTED SEI: {encryptedSei_toDisplay}</p> : <p>NO encrypted SEI</p> }

            {eip712 != null ?
            <p>eip712 created: {JSON.stringify(eip712)} </p> : <p>NO eip712</p>}

            {decryptedSei_toDisplay != null ?
            <p> Decrypted SEI: {decryptedSei_toDisplay}</p> : <p>NO decrypted SEI</p>}
        </div>
         
    );
}

export default WebAppConnectionToZama;

//<button onClick={getEncryptedsei}> Get Encrypted SEI</button>