import React, { Component } from 'react';
import Form from './Form.js';
import SupplierForm from './SupplierForm.js';
//import ZamaConnection from './ZamaConnection.js';
//import ZamaTest from './ZamaTest.js';
//import Zama from './Zama.js';
import './App.css';
//import ZamaConnection from './ZamaConnection.js';
import WebAppConnectionToZama from './WebAppConnectionToZama.js';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = { NumValues : [], currentUser: '', suppliers : [], supplier_id : "1" };
  }

  /*showDataset = (newDataset) => {
    //const dataset = {wc, ec};
    this.setState({NumValues : newDataset});
  }*/

  setCurrentUser = (str) => {
    console.log('Welcome %s, You are the Current User!', str);
    this.setState({currentUser : str});
  }

  setInputSupplier_ID = (e) => {
    this.setState({supplier_id : e.target.value});
  }

  //getSuppliersData ={this.addSupplierToList}
  /*addSupplierToList = (listaSuppliers) => {
    this.setState({suppliers : listaSuppliers});
  
    //this.setState({listaSuppliers : [this.state.UserName, this.state.Supplier_ID]});
    //[listaSuppliers[0], listaSuppliers[1]]
  }
  */
 //dataset={this.showDataset}
  //<ZamaConnection />
  render() {
    console.log('2g) GENITORE: Render App');
    return (
      <div className="App container-fluid">
        <header className="App-header">
          <h2>
            SUSTAINABILITY INDEXES DAPP
          </h2>
          <SupplierForm getUserName = {this.setCurrentUser}/>
          <Form />
          
         
         
          
          
          
          <div className="container">
           <section className="listanomi">
              <div className="row">
                <div className="col">
                <div className="form-group">
                <WebAppConnectionToZama supplierID = {this.state.supplier_id} />
                </div>
         
                </div>  
              </div>
           </section>    
           <section className="listapreferiti">
              <div className="row">
                <div className="col">
                  
                </div>
              </div>
            </section>
          </div>     
        </header>  
      </div>
    );
  }
}

export default App;

//<ZamaTest supplierID = {this.state.supplier_id} />

// Creo un supplier_id al momento della registrazione sulla piattaforma
// --> lo passo quando invoco il method di creazione del dataset e del supplier su SC
// playcontract = Play.load(contractAddress, web3, credentials, contractGasProvider);
/*
  //Web3j_Activity State Variables init
    //Web3j_Activity State Variables init
        init_Web3();
        verify_connection();
        setupBouncyCastle();

        //Init User
        try {
            init_User();
        } catch (CipherException | IOException | ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
        */
