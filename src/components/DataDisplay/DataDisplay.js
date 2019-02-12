import React from 'react';
import './DataDisplay.css';

const formatTime = (dateTime) => {
    return new Intl.DateTimeFormat('fi-FI', { hour: 'numeric', minute: 'numeric'}).format(new Date(dateTime.toString()));
  }


const DataDisplay = props => {
    let filteredData;
    if (props.display === 'arrival') { 
        filteredData = props.filteredData
        .filter(element => typeof(element.scheduledArrivalTime) !== 'undefined')
        .sort((a, b) => (a.scheduledArrivalTime > b.scheduledArrivalTime) ? 1 : -1)
        .map(train => ({...train, time: (train.actualArrivalTime && formatTime(train.actualArrivalTime) !== formatTime(train.scheduledArrivalTime)) ?  (<><span className="red">{formatTime(train.actualArrivalTime)}</span>
             <span className="under">({formatTime(train.scheduledArrivalTime)})</span></>) :
             formatTime(train.scheduledArrivalTime) }));
     } else {
     filteredData = props.filteredData
        .filter(element => typeof(element.scheduledDepartureTime) !== 'undefined')
        .sort((a, b) => (a.scheduledDepartureTime > b.scheduledDepartureTime) ? 1 : -1)
        .map(train => ({...train, time: (train.actualDepartureTime && formatTime(train.actualDepartureTime) !== formatTime(train.scheduledDepartureTime)) ?  (<><span className="red">{formatTime(train.actualDepartureTime)}</span>
             <span className="under">({formatTime(train.scheduledDepartureTime)})</span></>) :
             formatTime(train.scheduledDepartureTime) }));;
    } 
    console.log('TCL: filteredData', filteredData);
    const data = filteredData.map( train => (
    <tr key={(props.display === 'arrival') ? train.trainNumber + '_' + train.scheduledArrivalTime : train.trainNumber + '_' + train.scheduledDepartureTime}>
        <td>{train.trainNumber}</td>
        <td>{train.origin}</td>
        <td>{train.destination}</td>
        <td>{train.time}</td>
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
            {data}
            </tbody>
        </table>
    );
}

export default DataDisplay;
