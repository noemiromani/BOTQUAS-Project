import React, { Component } from 'react';
import Dataset from './Dataset.js';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { WaterConsumption : 30000, EnergyConsumption : 20000, listaDatasets : [], KPI_1 : 'Water Consumption [m3]', KPI_2: 'Energy Consumption[kW]', cont : 0};
    //this.state = { WaterConsumption : 1500, EnergyConsumption : 9, listaDatasets : [], KPI_1 : 'Average Salary', KPI_2: 'Number of Female Employees', cont : 0};
  }

  onChangeWaterConsumption = (e) => {
    console.log(e.target.value);
    this.setState({WaterConsumption : e.target.value});
  }

  onChangeEnergyConsumption = (e) => {
    console.log(e.target.value);
    this.setState({ EnergyConsumption : e.target.value});
  }

  onChangeKPI1 = (e) => {
    console.log(e.target.value);
    this.setState({ KPI_1 : e.target.value});
  }

  onChangeKPI2 = (e) => {
    console.log(e.target.value);
    this.setState({ KPI_2 : e.target.value});
  }

  invioForm = e => {
    e.preventDefault();
    //create array di datasets
    const newDataset = {wc: this.state.WaterConsumption, ec: this.state.EnergyConsumption};
    const contatore = this.state.cont + 1;
    //this.setState((state,props) => ({listaSuppliers : [newSupplier] }));
    this.setState({listaDatasets : [...this.state.listaDatasets, newDataset], cont: contatore});

    //const KPIs = [this.state.WaterConsumption, this.state.EnergyConsumption];
    //this.props.dataset(newDataset);
    this.setState({WaterConsumption: '', EnergyConsumption: ''})
    //this.props.dataset(this.state.WaterConsumption, this.state.EnergyConsumption);
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
          <h4> Create Dataset for CEI </h4>
          </div>
          <div className="row">
            <label> Key Performance Indicators </label>
            </div>
            <div className='row'>
            
            <input type="text" name="kPIs"
                            value={this.state.KPI_1}
                            onChange={this.onChangeKPI1}/>
          
          
            <input type="text" name="kPIs"
                            value={this.state.KPI_2}
                            onChange={this.onChangeKPI2}/>
          </div>
          <div className="row">
            <label> Values</label>
            </div>
            <div className='row'>
            
            <input type="text" name="wc"
                            value={this.state.WaterConsumption}
                            onChange={this.onChangeWaterConsumption}/>
          
            <input type="text" name="ec" 
                            value={this.state.EnergyConsumption}
                            onChange={this.onChangeEnergyConsumption}/> 
          </div>   
        </div>
        <button type="submit" onFocus={this.onFocus} className="btn btn-primary mb-4">Ok</button>
        <div className='row'>
            <div className = 'col'>
                {this.state.listaDatasets.map((el,index) => <Dataset key={index} datiDataset={el} cont={index}/>
                
                    )}
            </div>  
        </div>
        </form>
      </div>
    );
  }
} 

export default Form;