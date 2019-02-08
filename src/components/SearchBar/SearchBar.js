import React from 'react';
import Select, { createFilter } from 'react-select';
import './SearchBar.css';

const SearchBar = props => (
      <div className="SearchBar">
          <Select 
            onChange={selectedStation => props.onChange(selectedStation)}
            options={props.options}
            placeholder={props.placeholder}
            noOptionsMessage={props.noOptionsMessage}
            filterOption = {
              createFilter({
                ignoreCase: true, ignoreAccents: false, matchFrom: 'start' 
              })
            }
          />
      </div>
    );
  
export default SearchBar;