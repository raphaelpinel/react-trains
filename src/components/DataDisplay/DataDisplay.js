import React from 'react';
import './DataDisplay.css';

const formatTime = (dateTime) => { //returns a time in the correct timezone
    return new Intl.DateTimeFormat('fi-FI', { hour: 'numeric', minute: 'numeric'}).format(new Date(dateTime.toString()));
  }

const DataDisplay = props => {
    let filteredData;
    if (props.display === 'arrival') { 
        filteredData = props.filteredData
        .filter(element => typeof(element.scheduledArrivalTime) !== 'undefined') // filters out departures
        .sort((a, b) => (a.scheduledArrivalTime > b.scheduledArrivalTime) ? 1 : -1) // sorting by time
        .map(train => ({...train, time: (train.actualArrivalTime && formatTime(train.actualArrivalTime) !== formatTime(train.scheduledArrivalTime)) ?  //only if actual and scheduled arrival time differ, create special class (red) for actual time
        (<><span className="red">{formatTime(train.actualArrivalTime)}</span>
             <span className="under">({formatTime(train.scheduledArrivalTime)})</span></>) :
             formatTime(train.scheduledArrivalTime) }));
     } else { // for departures
     filteredData = props.filteredData
        .filter(element => typeof(element.scheduledDepartureTime) !== 'undefined') // filters out arrivals
        .sort((a, b) => (a.scheduledDepartureTime > b.scheduledDepartureTime) ? 1 : -1) // sorting by time
        .map(train => ({...train, time: (train.actualDepartureTime && formatTime(train.actualDepartureTime) !== formatTime(train.scheduledDepartureTime)) ?  //only if actual and scheduled departure time differ, special class (red) for actual time
        (<><span className="red">{formatTime(train.actualDepartureTime)}</span>
             <span className="under">({formatTime(train.scheduledDepartureTime)})</span></>) :
             formatTime(train.scheduledDepartureTime) }));;
    } 
    const finalData = filteredData.map( train => (
    <tr 
        key={(props.display === 'arrival') ? train.trainNumber + '_' + train.scheduledArrivalTime 
                                            : train.trainNumber + '_' + train.scheduledDepartureTime} // added timestamps to avoid duplicate keys
        className={(train.cancelled) ? 'cancelled' : null}>
            <td>{train.trainNumber}</td>
            <td>{train.origin}</td>
            <td>{train.destination}</td>
            <td>{train.time} {(train.cancelled) ? <span className="cancelled">Cancelled</span> : null}</td>
    </tr>));
    
    return (
        <table className="DataDisplay">
            <thead>
                <tr>
                    <th>Juna</th>
                    <th>Lähtöasema</th>
                    <th>Pääteasema</th>
                    <th>{(props.display === 'arrival') ? 'Saapuu' : 'Lähtee'}</th> 
                </tr>
            </thead>
            <tbody>
            {finalData}
            </tbody>
        </table>
    );
}

export default DataDisplay;
