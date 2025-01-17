import React from 'react';

function Supplier(props){
  return (
    <React.Fragment>
        <p> Supplier: Username: {props.datiSupplier.name}, ID: {props.datiSupplier.ID} </p>
      </React.Fragment>
  );
  
  /*class Supplier extends Component {
  constructor(props) {
    super(props);
    //this.UserName = this.props.UserName;
    //this.Supplier_ID = this.props.UserID;
  }
  render() {
    return (
      <div className="row">
        <p> Supplier: Username: {this.props.datiSupplier.name}, ID: {this.props.datiSupplier.ID} </p>
      </div>
    );
  }*/
        
} 

export default Supplier;