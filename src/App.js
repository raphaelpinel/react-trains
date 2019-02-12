import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
import './App.css';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import WithLoading from './hoc/withLoading';
import DataDisplay from './components/DataDisplay/DataDisplay';

const DataDisplayWithLoading = WithLoading(DataDisplay);

const API = 'https://rata.digitraffic.fi/api/v1/';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      stations: [], //sometimes needed as origin or destination
      passengerStations: [], //used for displaying suggestions in search input
      todaysTrains: [],
      selectedStation: null,
      filteredData: [],
      tabIndex: 0 // 0 = arrivals, 1 = departures
    }
  }

  handleInputChange = (selectedStation) => {
    this.setState({
      selectedStation
    });
    if (selectedStation) {
      this.filterData(selectedStation);
    }
  }

  componentDidMount() {
    this.fetchStations();
    this.fetchTodaysTrains();
  }

  fetchStations() {
    fetch(`${API}metadata/stations`)
    .then(response => response.json())
    .then(
      data => {
        const stations = data.map(station => ({ value: station.stationShortCode, label: station.stationName.includes(' asema') ? station.stationName.slice(0, -6) :  station.stationName}));
        const passengerStations = data.filter(station => station.passengerTraffic === true).map(station => ({ value: station.stationShortCode, label: station.stationName.includes(' asema') ? station.stationName.slice(0, -6) :  station.stationName}));
        this.setState({ stations, passengerStations });  
      }, 
      error => {
        this.setState({
          error
        });
      }
    )
  }

  fetchTodaysTrains() {
    const dateNow = new Date().toISOString().slice(0, 10);
    fetch(`${API}trains/${dateNow}`)
    .then(response => response.json())
    .then(
      data => {
        console.log('TCL: App -> fetchTodaysTrains -> data', data);
        this.setState({ todaysTrains: data, isLoaded: true });
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )   
  }

  filterData(selectedStation) { 
    const dateTimeNow = new Date().toJSON(); 
    const { todaysTrains, stations } = this.state;
    const filteredData = todaysTrains.map((train => {
      const trainNumber = train.commuterLineID ? `Commuter train ${train.commuterLineID}` : `${train.trainType} ${train.trainNumber}`;
      const originShortCode = train.timeTableRows[0].stationShortCode;
      const origin = stations.find(station => station.value === originShortCode).label;
      const destinationShortCode = train.timeTableRows[train.timeTableRows.length - 1]['stationShortCode'];
      const destination = stations.find(station => station.value === destinationShortCode).label;
      
      let scheduledArrivalTime; // arrivals
      let actualArrivalTime;
      const arrivalTimeTable = {...train.timeTableRows.filter(element => element.stationShortCode === selectedStation.value && element.type === 'ARRIVAL')[0]};
      if(arrivalTimeTable) {
        if (arrivalTimeTable.hasOwnProperty('scheduledTime')) {
          scheduledArrivalTime = arrivalTimeTable.scheduledTime;  
        }
        if(arrivalTimeTable.hasOwnProperty('actualTime')) {
          actualArrivalTime =  arrivalTimeTable.actualTime;  
        } else if (arrivalTimeTable.hasOwnProperty('liveEstimateTime')) {
          actualArrivalTime = arrivalTimeTable.liveEstimateTime;
        } else {
          actualArrivalTime = false;
        }
      } 
      let scheduledDepartureTime; // departures
      let actualDepartureTime;
      const departureTimeTable = {...train.timeTableRows.filter(element => element.stationShortCode === selectedStation.value && element.type === 'DEPARTURE')[0]}
      if(departureTimeTable) {
        if (departureTimeTable.hasOwnProperty('scheduledTime')) {
          scheduledDepartureTime = departureTimeTable.scheduledTime;
        }
        if(departureTimeTable.hasOwnProperty('actualTime')) {
          actualDepartureTime =  departureTimeTable.actualTime;
        } else if (departureTimeTable.hasOwnProperty('liveEstimateTime')) {
          actualDepartureTime = departureTimeTable.liveEstimateTime;
        } else {
          actualDepartureTime = false;
        }
      }

      return {...train, trainNumber, origin, destination, scheduledArrivalTime, actualArrivalTime,  scheduledDepartureTime, actualDepartureTime};
    }))
    .filter(train => train.trainCategory !== 'Cargo')
    .filter(train => train.actualArrivalTime > dateTimeNow || train.scheduledArrivalTime > dateTimeNow || train.actualDepartureTime > dateTimeNow || train.scheduledDepartureTime > dateTimeNow);
    this.setState({filteredData});
    console.log('TCL: App -> filterData -> filteredData', filteredData)
  }

  render() {  
    const { error, isLoaded, tabIndex, filteredData } = this.state;
    return (
      <div className="App">
        <Header title="Aseman junatiedot" />
        <SearchBar 
        placeholder="Hae aseman nimellä"
        noOptionsMessage={(inputValue) => "Ei löydetty"}
        options={this.state.passengerStations} 
        onChange={this.handleInputChange} 
        />
        <Tabs selectedIndex={tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
          <TabList>
              <Tab>Saapuvat</Tab>
              <Tab>Lähtevät</Tab>
          </TabList>
          <TabPanel>
            <DataDisplayWithLoading
            isLoaded={isLoaded} 
            display='arrival' 
            filteredData={filteredData} 
            />   
            <div className="error">{ error ? error.message : null }</div>
          </TabPanel>
          <TabPanel>
            <DataDisplayWithLoading 
            isLoaded={isLoaded}  
            display='departure' 
            filteredData={filteredData} 
            />   
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;
