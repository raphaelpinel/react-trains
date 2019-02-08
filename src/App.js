import React, { Component } from 'react';
import './App.css';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';

const API = 'https://rata.digitraffic.fi/api/v1/';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading:true,
      stations: [],
      selectedStation: null
    }
  }

  handleInputChange = (selectedStation) => {
    this.setState({
      selectedStation: selectedStation.label
    });
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    this.fetchData();
  }

  fetchData() {
    fetch(`${API}metadata/stations`)
    .then(response => response.json())
    .then(data => {
      const stations = data.filter(station => station.passengerTraffic === true).map(station => ({ value: station.stationName, label: station.stationName}));
      this.setState({ stations, isLoading: false });  
    })
    .catch(error => console.log('parsing failed', error)
    );
  }

  render() { 
    return (
      <div className="App">
        <Header title="Aseman junatiedot" />
        <SearchBar 
        placeholder="Hae aseman nimellä"
        noOptionsMessage={(inputValue) => "Ei löydetty"}
        options={this.state.stations} 
        onChange={this.handleInputChange} 
        />
      </div>
    );
  }
}

export default App;
