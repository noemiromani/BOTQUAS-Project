// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import {SepoliaZamaFHEVMConfig} from "fhevm/config/ZamaFHEVMConfig.sol";

contract zamaTest is SepoliaZamaFHEVMConfig{
    //euint32 public x;
    mapping(uint => address) public addresses; // INTERNAL
	mapping(uint => mapping(address => bool)) public is_allowed;
	mapping(address => uint) public suppliers; // INTERNAL
	mapping(uint => Supplier) public Suppliers; //da internal a public --> def: INTERNAL
	mapping(uint => bool) public is_Supplier;

    /*constructor(){
        x = TFHE.asEuint32(0);
        TFHE.allowThis(x);
    }

    function setValue(uint32 value) public {
        x = TFHE.asEuint32(value);
        TFHE.allowThis(x);
    }
    */

    struct Supplier{
		mapping(string => euint32) SEI_INDEX;
		euint32 SEI_index; 
		euint32 CEI_index; 
		euint32[] scores_CEI; 
		euint32[] scores_SEI;
	}

	struct Dataset_SocialEconomicImpact{
		uint supplier_id;
		mapping(string => euint32) KPIs;
		euint32[] numeric_values;
		euint32 SEI_score;
		string[] Identifiers; 
	}

	struct Dataset_CircularEnvironmentalImpact{
		uint supplier_id;
		euint32 batch_id;
		mapping(string => euint32) KPIs;
		euint32[] numeric_values;
		euint32 CEI_score;
		string[] Identifiers;
	}

	mapping(uint => Dataset_SocialEconomicImpact) public datasets; //da internal a public --> def: INTERNAL
	mapping(uint => Dataset_CircularEnvironmentalImpact) public _datasets; //da internal a public --> def: INTERNAL
	mapping(uint => bool) public is_Dataset;

	mapping(address => mapping(address => mapping(euint32 => bool))) permissions; // users => contracts => identifiers[]

	event NewSupplier(address wallet, uint supplier_id);
	event NewDatasetUploaded(uint dataset_id);
	event DatasetRemoved(uint dataset_id);

	modifier OnlySupplier(){
		//require(suppliers[msg.sender] > 0, "You are not a supplier!");
		require(is_Supplier[suppliers[msg.sender]], "You are not a supplier!");
		_;
	}

	modifier OnlySupplierOf(uint dataset_id){
		require (datasets[dataset_id].supplier_id == suppliers[msg.sender] || _datasets[dataset_id].supplier_id == suppliers[msg.sender] ,"You cannot manage this set of data!");
		_;
	}

	modifier OnlyStoredDataset(uint dataset_id){
		require(datasets[dataset_id].supplier_id > 0 || _datasets[dataset_id].supplier_id > 0, "Is Not possibile to find this Dataset!");
		_;
	}

	modifier onlyAllowed(uint supplier_id) {
		require(suppliers[msg.sender] == supplier_id || permissions[addresses[supplier_id]][msg.sender][Suppliers[supplier_id].SEI_index],
		"User didn't give you permission to access this identifier."
		);
		_;
		
		// VERSIONE 0.5.0
		/* require(suppliers[msg.sender] == supplier_id || is_allowed[supplier_id][msg.sender] == true,
		"User didn't give you permission to access this identifier."
		);
		_; */
	}

	function addSupplier(uint supplier_id) public { 
		//the id is directly provided by the supplier, from the client-side platform
		require (supplier_id > 0, "The supplier Id needs to be > 0"); 
		require (is_Supplier[supplier_id] == false, "This 'id' is already associated to an existing Supplier!");
		suppliers[msg.sender] = supplier_id;
		is_Supplier[supplier_id] = true;
		addresses[supplier_id] = msg.sender;
		emit NewSupplier(msg.sender, supplier_id);
	}

	function addDataset_SocialEconomicSustainability(uint dataset_id, string[] calldata identifiers, uint32[] calldata values) public OnlySupplier {  
		require(is_Dataset[dataset_id] == false, "This 'id' is already associated to an existing Dataset!");
		require(datasets[dataset_id].supplier_id == 0, "This dataset has been already stored!");
		
		//Dataset creation
		Dataset_SocialEconomicImpact storage newDataset = datasets[dataset_id];
		//the dataset's supplier_id attribute is assigned in order to prevent other supplier from managing the unproper datasets;
		is_Dataset[dataset_id] = true;
		newDataset.supplier_id = suppliers[msg.sender];
		emit NewDatasetUploaded(dataset_id);

		//Encryption of values through th TFHE Library
		for (uint i=0; i<values.length;i++){
			euint32 value = TFHE.asEuint32(values[i]);
            TFHE.allowThis(value);
            newDataset.numeric_values.push(value);
		}

		for (uint j=0; j<identifiers.length; j++){
			newDataset.Identifiers.push(identifiers[j]);
		}

		//Call to the internal function for identifiers'setting
		_setSEIidentifiers(dataset_id);

		//Call to the internal function for computing the SEI_index, and the SEI_score 
		_computeSEIscore(dataset_id);
	} 

	function getIdentifiers(uint dataset_id, uint i) public view returns (string memory) {
		Dataset_SocialEconomicImpact storage Dataset = datasets[dataset_id];
		return Dataset.Identifiers[i];
	}

    //onlyAllowed1(datasets[dataset_id].supplier_id) --> per accedere al supplier_id dal dataset
	function getMappingValues(uint dataset_id, string calldata a) public view returns (euint32 return_value) { //
		
		Dataset_SocialEconomicImpact storage Dataset = datasets[dataset_id];
		for (uint i =0; i < Dataset.Identifiers.length; i++){
			if ((keccak256(bytes(a))) == (keccak256(bytes(Dataset.Identifiers[i])))){
				return_value = Dataset.KPIs[Dataset.Identifiers[i]];
			}
		}
		return return_value;
	}

	function getNumericValues(uint dataset_id, uint i) public view onlyAllowed(datasets[dataset_id].supplier_id) returns (euint32) {
		Dataset_SocialEconomicImpact storage Dataset = datasets[dataset_id];
		return Dataset.numeric_values[i];
	}

	function getSEI(uint supplier_id) public view returns (euint32) {
		Supplier storage supplier = Suppliers[supplier_id];
		return supplier.SEI_index;
	}

    //string[] calldata identifiers, euint32[] calldata encrypted_values
	function _setSEIidentifiers(uint dataset_id) internal OnlySupplierOf(dataset_id) {
		Dataset_SocialEconomicImpact storage dataset = datasets[dataset_id];
		string memory _string;
		euint32 _value;
		for (uint i=0; i<dataset.Identifiers.length && i<dataset.numeric_values.length; i++){
			_string = dataset.Identifiers[i];
			_value = dataset.numeric_values[i]; //
			dataset.KPIs[_string] = _value; //
		}
	}

	function _computeSEIscore(uint dataset_id) internal OnlySupplierOf(dataset_id) returns (euint32){
		//Compute the SEI_score 
		Dataset_SocialEconomicImpact storage dataset = datasets[dataset_id];
		for (uint256 i = 0; i < dataset.numeric_values.length; i++) {
            dataset.SEI_score = TFHE.add(dataset.SEI_score, dataset.numeric_values[i]);  
            TFHE.allowThis(dataset.SEI_score);
            TFHE.allow(dataset.SEI_score, msg.sender);
            
		}
	
		//Insert the score above computed into the Supplier's scores_SEI array, to keep memory of the annual supplier's SEI_indexes;
		Supplier storage supplier = Suppliers[dataset.supplier_id];
		supplier.SEI_index = dataset.SEI_score;
		supplier.scores_SEI.push(dataset.SEI_score); //The SEI score is updated on annual basis; keep the array only if you want to keep track of all the Supllier's SEI scores;

        TFHE.allowThis(supplier.SEI_index);
        TFHE.allow(supplier.SEI_index, msg.sender);
		
		return dataset.SEI_score;
	} 

	/*function addDataset_CirculateEnvironmentalSustainability(uint dataset_id, uint32 _batchid, string[] calldata identifiers, uint32[] calldata values) public OnlySupplier {
		require (is_Dataset[dataset_id] == false, "This 'id' is already associated to an existing Dataset!");
		require(_datasets[dataset_id].supplier_id == 0, "This dataset has been already stored!");

		//Dataset creation
		Dataset_CircularEnvironmentalImpact storage newDataset = _datasets[dataset_id];
		//the dataset's supplier_id attribute is assigned in order to prevent other supplier from managing the unproper datasets;
		newDataset.supplier_id = suppliers[msg.sender];
		emit NewDatasetUploaded(dataset_id);

		// Encrypt the batch_id
		euint32 batch_id = TFHE.asEuint32(_batchid);
		newDataset.batch_id = batch_id;

		//Encryption of values through th TFHE Library
		for (uint i=0; i<values.length;i++){
			euint32 value = TFHE.asEuint32(values[i]);
            newDataset.numeric_values.push(value);
		}
		for (uint j=0; j<identifiers.length; j++){
			newDataset.Identifiers.push(identifiers[j]);	
		}	
		//Call to the internal function fot identifiers'setting
		_setCEIidentifiers(dataset_id);
		//Call to the internal function for computing the SEI_index, and the SEI_score 
		_computeCEIscore(dataset_id);
	} 

	function _setCEIidentifiers(uint dataset_id) internal OnlySupplierOf(dataset_id) {
		Dataset_CircularEnvironmentalImpact storage dataset = _datasets[dataset_id];
		string memory _string;
		euint32 _value;
		for (uint i=0; i<dataset.Identifiers.length && i<dataset.numeric_values.length; i++){
			_string = dataset.Identifiers[i];
			_value = dataset.numeric_values[i]; //
			dataset.KPIs[_string] = _value; //
		}
	}

	function _computeCEIscore(uint dataset_id) internal OnlySupplierOf(dataset_id) returns (euint32){
		//Compute the CEI_score 
		Dataset_CircularEnvironmentalImpact storage dataset = _datasets[dataset_id];
		for (uint256 i = 0; i < dataset.numeric_values.length; i++) {
            dataset.CEI_score = TFHE.add(dataset.CEI_score, dataset.numeric_values[i]);  
		}
	
		//Insert the score above computed into the Supplier's scores_SEI array, to keep memory of the annual supplier's SEI_indexes;
		Supplier storage supplier = Suppliers[dataset.supplier_id];
		supplier.scores_CEI.push(dataset.CEI_score); //In this case the Supplier's the CEI_index is not defined, as it will be calculated at the end of a period, by considering all the CEI_scores deriving from all the Supplier's batches

		_computeSupplierCEIscore(dataset.supplier_id);
		return dataset.CEI_score;
	} 

	function _computeSupplierCEIscore(uint supplier_id) internal OnlySupplier returns (euint32){
		Supplier storage supplier = Suppliers[supplier_id];
		euint32 sumOfCEIs;
		uint32 n;
		//Compute the sum of CEI scores 
		for (uint256 i = 0; i < supplier.scores_CEI.length; i++) {
			euint32 value = supplier.scores_CEI[i];
            sumOfCEIs = TFHE.add(sumOfCEIs, value); 
			n++; 
		}
		//Compute the CEI index as the average value 
		supplier.CEI_index = TFHE.div(sumOfCEIs, n);

		return supplier.CEI_index;
	}

	function removeDataset(uint dataset_id) public OnlySupplierOf(dataset_id) OnlyStoredDataset(dataset_id){
		if (datasets[dataset_id].supplier_id > 0) { 
			delete datasets[dataset_id];
		} else if (_datasets[dataset_id].supplier_id > 0) { 
			delete _datasets[dataset_id];
		}
		emit DatasetRemoved(dataset_id);
	}

	function modifyDataset(uint dataset_id, string memory identifier, uint32 value) public OnlySupplierOf(dataset_id) OnlyStoredDataset(dataset_id){
		//require(insertedSEI[identifier] || insertedCEI[identifier] , "This identifier is not part of any dataset!");
		euint32 encrypted_value = TFHE.asEuint32(value);

		//make sure the dataset belongs to the SE type
		if (datasets[dataset_id].supplier_id > 0) { 
			Dataset_SocialEconomicImpact storage dataset = datasets[dataset_id];
			for (uint i =0; i < dataset.numeric_values.length; i++){
				//define the numeric value corresponding to that identifier
				euint32 _value = dataset.KPIs[identifier];
				//make sure the array contains a numeric value equal to the one corresponding to the the value before computed (Equal condition)
				ebool isSame = TFHE.eq(_value, dataset.numeric_values[i]);
				//if the condition is satisfied, update the dataset's numeric array 'values_SEI', by substituting the old numeric value corresponding to that identifier with the new encrypted one
				dataset.numeric_values[i] = TFHE.select(isSame, encrypted_value, _value);
			}
			//Insert the new encrypted value into the dataset's mapping 
			dataset.KPIs[identifier] = encrypted_value;

			//Call to this internal method to update, if required, the dataset's score and the Supplier's index_SEI
			_updateSEIscore(dataset_id, datasets[dataset_id].numeric_values);
			
		//make sure the dataset belongs to the CE type, Same reasoning as above
		} else if (_datasets[dataset_id].supplier_id > 0) { 
			Dataset_CircularEnvironmentalImpact storage dataset = _datasets[dataset_id];
			for (uint i =0; i < dataset.numeric_values.length; i++){
				euint32 _value = dataset.KPIs[identifier];
				ebool isSame = TFHE.eq(_value, dataset.numeric_values[i]);
				dataset.numeric_values[i] = TFHE.select(isSame, encrypted_value, _value);
			}
			
			dataset.KPIs[identifier] = encrypted_value;

			_updateCEIscore(dataset_id, _datasets[dataset_id].numeric_values);	
		}
	}

	function _updateSEIscore(uint dataset_id, euint32[] memory values) internal OnlySupplierOf(dataset_id) OnlyStoredDataset(dataset_id) returns (euint32) {
		//Compute the updated score associated to the modified dataset
		euint32 current_score = datasets[dataset_id].SEI_score;
		euint32 updated_score;
		for (uint i=0; i<values.length;i++){
			updated_score = TFHE.add(updated_score, values[i]);
		}
		//make sure the score has changed (NOT Equal contion)
		ebool isDifferentScore = TFHE.ne(current_score, updated_score);
		//if the score has changed, update the value of the dataset's score_CEI attribute
		datasets[dataset_id].SEI_score = TFHE.select(isDifferentScore, updated_score, current_score); 

		//update the Supplier's index_SEI, which is defined once a year, if the score has changed
		Supplier storage supplier = Suppliers[datasets[dataset_id].supplier_id];
		supplier.SEI_index = TFHE.select(isDifferentScore, updated_score, current_score); 

		//inspect the supplier's scores_SEI array to update one of the values
		for (uint i=0; i<supplier.scores_SEI.length;i++){
			euint32 current_value = supplier.scores_SEI[i];
			//make sure there is one value equal to the NON updated score (Equal contion)
			ebool isSame = TFHE.eq(current_score, current_value);
			//And condition
			ebool hasChanged = TFHE.and(isDifferentScore, isSame);
			//if the score has changed and one value equalto the old score has been found, update that value into the array
			supplier.scores_SEI[i] = TFHE.select(hasChanged, updated_score, current_value);	
		}
		return updated_score;
	}

	function _updateCEIscore(uint dataset_id, euint32[] memory values) internal OnlySupplierOf(dataset_id) OnlyStoredDataset(dataset_id) returns (euint32){
		//Compute the updated score associated to the modified dataset
		euint32 current_score = _datasets[dataset_id].CEI_score;
		euint32 updated_score;
		for (uint i=0; i<values.length;i++){
			updated_score = TFHE.add(updated_score, values[i]);	
		}
		//make sure the score has changed (NOT equal condition)
		ebool isDifferentScore = TFHE.ne(current_score, updated_score);
		//if the score has changed, update the value of the dataset's score_CEI attribute
		_datasets[dataset_id].CEI_score = TFHE.select(isDifferentScore, updated_score, current_score); 

		Supplier storage supplier = Suppliers[_datasets[dataset_id].supplier_id]; 
		//inspect the supplier's scores_CEI array to update one of the values
		for (uint i=0; i<supplier.scores_CEI.length;i++){
			euint32 current_value = supplier.scores_CEI[i];
			//make sure there is one value equal to the NON updated score (Equal contion)
			ebool isSame = TFHE.eq(current_score, current_value);
			//AND condition
			ebool hasChanged = TFHE.and(isDifferentScore, isSame);
			//if the score has changed and one value equal to the old score has been found, update that value into the array
			supplier.scores_CEI[i] = TFHE.select(hasChanged, updated_score, current_value);	
		}
		return updated_score;
	}
    */

	/* //Get the dataset's score
	function reencryptDatasetScore(
        uint dataset_id,
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
		//Call to the internal function for accessing the dataset's identifier;
        euint32 score = _getDatasetScore(dataset_id);
        require(TFHE.isInitialized(score), "This identifier is unknown");

        return TFHE.reencrypt(score, publicKey,0);
    } 

    function _getDatasetScore(uint dataset_id) internal view OnlyStoredDataset(dataset_id) OnlySupplierOf(dataset_id) returns (euint32) {
		if (datasets[dataset_id].supplier_id > 0) {
			return datasets[dataset_id].SEI_score;
		} else {
			 return _datasets[dataset_id].CEI_score;	
		}        
    }

	//Get the Supplier's SEI Sustainability index
	function reencryptSupplierSEIIndex(
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
		//Call to the internal function for accessing the dataset's identifier;
        euint32 index = _getSupplierSEIindex();
        require(TFHE.isInitialized(index), "This identifier is unknown");

        return TFHE.reencrypt(index, publicKey,0);
    }

    function _getSupplierSEIindex() internal view OnlySupplier returns (euint32) {
		return Suppliers[suppliers[msg.sender]].SEI_index;    
    }

	//Get the OTHER Supplier's SEI Sustainability index
	function reencryptOtherSupplierSEIIndex(
		uint supplier_id,
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
		//Call to the internal function for accessing the dataset's identifier;
        euint32 index = _getOtherSupplierSEIindex(supplier_id);
        require(TFHE.isInitialized(index), "This identifier is unknown");

        return TFHE.reencrypt(index, publicKey,0);
    }

    function _getOtherSupplierSEIindex(uint supplier_id) internal view OnlySupplier onlyAllowed(supplier_id) returns (euint32) {
		return Suppliers[supplier_id].SEI_index;    
    }

	//Get the Supplier's CEI Sustainability index
	function reencryptSupplierCEIIndex(
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
		//Call to the internal function for accessing the dataset's identifier;
        euint32 index = _getSupplierCEIindex();
        require(TFHE.isInitialized(index), "This identifier is unknown");

        return TFHE.reencrypt(index, publicKey, 0);
    }

    function _getSupplierCEIindex() internal view OnlySupplier returns (euint32) {
		return Suppliers[suppliers[msg.sender]].CEI_index;    
    }

	//Get the value of a specifica identifier through reencryption;
	function reencryptIdentifier(
        uint dataset_id,
        string calldata identifier,
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
		//Call to the internal function for accessing the dataset's identifier;
        euint32 ident = _getIdentifier(dataset_id, identifier);
        require(TFHE.isInitialized(ident), "This identifier is unknown");

        return TFHE.reencrypt(ident, publicKey, 0);
    }

//vedi funzione definta SOPRA per accedere agli identifier
    function _getIdentifier(uint dataset_id, string calldata identifier) internal view OnlyStoredDataset(dataset_id) OnlySupplierOf(dataset_id) returns (euint32 return_value) {
		
		if (datasets[dataset_id].supplier_id > 0) {
			Dataset_SocialEconomicImpact storage dataset = datasets[dataset_id];
			for (uint i =0; i < dataset.Identifiers.length; i++){
				if ((keccak256(bytes(identifier))) == (keccak256(bytes(dataset.Identifiers[i])))){
					return_value = dataset.KPIs[dataset.Identifiers[i]];
				}
			}
			return return_value;
		} else{
			Dataset_CircularEnvironmentalImpact storage _dataset = _datasets[dataset_id];
			for (uint i =0; i < _dataset.Identifiers.length; i++){
				if ((keccak256(bytes(identifier))) == (keccak256(bytes(_dataset.Identifiers[i])))){
					return_value = _dataset.KPIs[_dataset.Identifiers[i]];
				}
			}
			return return_value;
		} 
    } */

	function grantAccess(address allowed) public {
		require (suppliers[allowed] > 0, "You cannot grant access to this address! This address is not associated to a supplier!");
		//for (uint i = 0; i < identifiers.length; i++) {
			uint id = suppliers[msg.sender];
			permissions[msg.sender][allowed][Suppliers[id].SEI_index] = true;
		//}

		// VERSIONE 0.5.0 --> grant or revoke access to specific suppliers (addresses) through TFHE.allow;
		// --> in this case, for reencryption, as users are going to sign a public key associated with a specifci contract, the access should be provided to both the contract and the addresses;
	/* 	uint id = suppliers[msg.sender];
		TFHE.allow(Suppliers[id].SEI_index, address(this));
		for (uint i = 0; i < addresses.length; i++) {
			TFHE.allow(Suppliers[id].SEI_index, addresses[i]);
			is_allowed[id][addresses[i] = true;
		} */	
	}

	function revokeAccess(address allowed) public {
		require (suppliers[allowed] > 0, "You cannot grant access to this address! This address is not associated to a supplier!");
      	uint id = suppliers[msg.sender];
		delete permissions[msg.sender][allowed][Suppliers[id].SEI_index];
    }
}


