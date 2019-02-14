import React from 'react';
import { useTranslation } from 'react-i18next';

const WithLoading = Component => {
    const { t, i18n } = useTranslation();
    return ({ isLoaded, ...props }) => {
        if (isLoaded) { return (<Component {...props} />) }
        return (<p>{t('Loading')}...</p>);
    }
}

export default WithLoading;