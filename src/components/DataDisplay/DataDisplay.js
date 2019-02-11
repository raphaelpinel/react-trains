import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import styles from './DataDisplay.module.css'

const DataDisplay = props => {
    let filteredData;
    props.display === 'arrival' ? filteredData = props.filteredData.filter(element => typeof(element.scheduledArrivalTime) !== 'undefined') : filteredData = props.filteredData.filter(element => typeof(element.scheduledDepartureTime) !== 'undefined');
    console.log('TCL: filteredData', filteredData);
    const data = filteredData.map( train => (
    <tr key={train.trainNumber} className="table-row">
        <td>{train.trainNumber}</td>
        <td>{train.origin}</td>
        <td>{train.destination}</td>
        <td>{(props.display === 'arrival') ? train.scheduledArrivalTime : train.scheduledDepartureTime}</td>
    </tr>));
    
    return (
        <table className={styles.DataDisplay}>
            <thead>
                <tr className="table-header">
                    <th>Juna</th>
                    <th>Lähtöasema</th>
                    <th>Pääteasema</th>
                    <th>Saapuu</th> 
                </tr>
            </thead>
            <tbody>
            {data}
            </tbody>
        </table>
    );
}

export default DataDisplay;
