import axios from 'axios';

function handleError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error - Response Data');
        console.log(error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('Error - Request');
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    console.log('Error config');
    console.log(error.config);
}

export default function getIpLocation() {
    return axios.post(`https://ipinfo.io?token=${process.env.IP_API_KEY}`)
        .then(res => res.data)
        .catch(e => handleError(e));
}
