import React from 'react';
import styles from './DataDisplay.module.css';

const formatTime = (dateTime) => {
    return new Intl.DateTimeFormat('fi-FI', { hour: 'numeric', minute: 'numeric'}).format(new Date(dateTime.toString()));
  }


const DataDisplay = props => {
    let filteredData;
    props.display === 'arrival' ? filteredData = props.filteredData.filter(element => typeof(element.scheduledArrivalTime) !== 'undefined').sort((a, b) => (a.scheduledArrivalTime > b.scheduledArrivalTime) ? 1 : -1) : filteredData = props.filteredData.filter(element => typeof(element.scheduledDepartureTime) !== 'undefined').sort((a, b) => (a.scheduledDepartureTime > b.scheduledDepartureTime) ? 1 : -1);
    console.log('TCL: filteredData', filteredData);
    const data = filteredData.map( train => (
    <tr key={train.trainNumber}>
        <td>{train.trainNumber}</td>
        <td>{train.origin}</td>
        <td>{train.destination}</td>
        <td>{(props.display === 'arrival') ? formatTime(train.scheduledArrivalTime) : formatTime(train.scheduledDepartureTime)}</td>
    </tr>));
    
    return (
        <table className={styles.DataDisplay}>
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
