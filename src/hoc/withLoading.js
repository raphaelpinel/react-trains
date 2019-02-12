import React from 'react';

const WithLoading = Component => {
    return ({ isLoaded, ...props }) => {
        if (isLoaded) { return (<Component {...props} />) }
        return (<p>Loading...</p>);
    }
}

export default WithLoading;