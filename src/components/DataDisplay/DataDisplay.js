import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import styles from './DataDisplay.module.css'

const DataDisplay = props => {
    let filteredData;
    props.display === 'arrival' ? filteredData = props.filteredData.filter(element => typeof(element.scheduledArrivalTime) !== 'undefined') : filteredData = props.filteredData.filter(element => typeof(element.scheduledDepartureTime) !== 'undefined');
	console.log('TCL: filteredData', filteredData);
    
    return (
        <div className={styles.DataDisplay}>
            <ReactTable 
            data={props.filteredData}
            columns={[
                {Header: 'Juna', accessor: 'trainNumber'},
                {Header: 'Lähtöasema', accessor: 'origin'},
                {Header: 'Pääteasema', accessor: 'destination'},
                {Header: 'Saapu', accessor: (props.display === 'arrival') ? 'scheduledArrivalTime' : 'scheduledDepartureTime'}
            ]}
            className="-striped -highlight"
            />
        </div>
    );
}

export default DataDisplay;
