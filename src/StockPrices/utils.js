import fetchTimeout from 'fetch-timeout';
import * as constants from './constants';

export const fetchUrl = url => 
    fetchTimeout(url, {}, constants.FETCH_TIMEOUT, 'timeout')
        .then(res => { 
        if (!res.ok) {
            throw Error(res.statusText);
        }
        return res.json();
    });

export const catchFetchErrors = error => {
    let log, displayErrorMessage;

    if (error === 'timeout') {
        log = 'Request timeout';
        displayErrorMessage = constants.ERRORS.TIMEOUT;
    } else {
        log = error.message;
        displayErrorMessage = constants.ERRORS.GENERAL;
    }

    console.log(`Oh no, something happened: ${log}`);
    this.setState({
        errorMessage: displayErrorMessage
    });
};