import React from 'react';

function Dataset(props){
  return (
    <React.Fragment>
        <p> Dataset_{props.cont}: Water Consumption: {props.datiDataset.wc} , Energy Consumption: {props.datiDataset.ec} </p>
      </React.Fragment>
  );

/*class Dataset extends Component {
  constructor(props) {
    super(props);
    //this.WatConsumption = this.props.WatCons;
    //this.EnConsumption = this.props.EnCons;
  }
  render() {
    return (
      <div className="row">
        <p> Dataset_{this.props.cont}: Water Consumption: {this.props.datiDataset.wc} , Energy Consumption: {this.props.datiDataset.ec} </p>
      </div>
    );
  }*/
        
} 

export default Dataset;