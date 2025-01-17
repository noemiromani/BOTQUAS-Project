import React, { Component } from 'react';
import Supplier from './Supplier.js';

class SupplierForm extends Component {
  constructor(props) {
    super(props);
    this.state = { UserName : 'noemi.romani', Supplier_ID : 1, WalletAddress: '0xE518AfAc620D26749A0fBC46C08A8D4c14233beC', listaSuppliers : [], cont : 0};
    //this.UserName = 'noemi.romani';
    //this.Supplier_ID = 1;
  }

  onChangeUserName = (e) => {
    console.log(e.target.value);
    this.setState({UserName : e.target.value});
  }

  onChangeSupplier_ID = (e) => {
    console.log(e.target.value);
    this.setState({ Supplier_ID : e.target.value});
  }

  onChangeWalletAddress = (e) => {
    console.log(e.target.value);
    this.setState({ WalletAddress : e.target.value});
  }

  /*addSupplier = (e) => {
    e.preventDefault();
    const newSupplier = {name: this.state.UserName, ID: this.state.Supplier_ID};
    const contatore = this.state.cont + 1;
    //this.setState((state,props) => ({listaSuppliers : [newSupplier] }));
    this.setState({listaSuppliers : [...this.state.listaSuppliers, newSupplier], cont: contatore});
  }*/

  invioForm = e => {
    e.preventDefault();
    const newSupplier = {name: this.state.UserName, ID: this.state.Supplier_ID};
    const contatore = this.state.cont + 1;
    //this.setState((state,props) => ({listaSuppliers : [newSupplier] }));
    this.setState({listaSuppliers : [...this.state.listaSuppliers, newSupplier], cont: contatore});
    
    
    this.props.getUserName(this.state.UserName);
    
    this.setState({UserName: '', Supplier_ID: ''})  
  }

  onFocus = (e) =>{
    e.target.blur();
  }
 
  render() {
    return (
      <div className="row">
        <form className="form-inline" onSubmit={this.invioForm}>
        <div className="form-group">
          <div className = "row">
          <h4> Create your Supplier's Identity</h4>
          </div>
          <div className="row">
            <label> Username </label>
            </div>
            <div className='row'>
            <input type="text" name="UserName"
                            value={this.state.UserName}
                            onChange={this.onChangeUserName}/>
          </div>
          <div className='row'>
          <label> Supplier ID </label>
          </div>
          <div className="row">
            <input type="text" name="Supplier_ID" 
                            value={this.state.Supplier_ID}
                            onChange={this.onChangeSupplier_ID}/> 
          </div> 
          <div className="row">
          <label> Wallet Address </label>
          </div>
          <div className="row">
            <input type="text" name="WalletAddress" 
                            value={this.state.WalletAddress}
                            onChange={this.onChangeWalletAddress}/> 
          </div>  
        </div>
        <div className='row'>
            <div className = 'col'>
                {this.state.listaSuppliers.map((el,index) => <Supplier key={el.ID} datiSupplier={el}/>
                
                    )}
            </div>  
        </div>
        <button type="submit" onFocus={this.onFocus} className="btn btn-primary mb-4">Ok</button>
        
        
        
        </form>
      </div>
    );
  }
} 

export default SupplierForm;