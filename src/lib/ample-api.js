/* eslint-disable */
const axios = require('axios');

const instance = axios.create({
  baseURL: process.env.AMPLE_API_URL,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
});

const handleError = function(error) {
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
};

export function callPostUser(userId) {
  return instance
    .post('/user', { userId: userId })
    .then(res => res.data)
    .catch(e => handleError(e));
}

export function callPostUserName(userId, userName) {
  return instance
    .post('/user/name', { userId: userId, name: userName })
    .then(res => res.data)
    .catch(e => handleError(e));
}
export function callPostUserEmail(userId, userEmail) {
  return instance
    .post('/user/email', { userId: userId, email: userEmail })
    .then(res => res.data)
    .catch(e => handleError(e));
}
export function callPostOnboarding(userId, onboardingResponse) {
  return instance
    .post('/user/onboarding-questions', {
      userId: userId,
      onboardingResponse: onboardingResponse
    })
    .then(res => res.data)
    .catch(e => handleError(e));
}
export function callPostFeedback(
  message,
  feedbackType,
  serviceType,
  providerName
) {
  return instance
    .post('/feedback', {
      message: message,
      feedbackType: feedbackType ? feedbackType : 'N/A',
      serviceType: serviceType ? serviceType : 'N/A',
      providerName: providerName ? providerName : 'N/A'
    })
    .then(res => res.data)
    .catch(e => handleError(e));
}
export function callPostNPS(userId, helpfulness, wouldRecommend) {
  return instance
    .post('/nps', {
      userId: userId,
      helpfulness: helpfulness,
      wouldRecommend: wouldRecommend
    })
    .then(res => res.data)
    .catch(e => handleError(e));
}
export function callPostAddService(
  userId,
  serviceType,
  orgName,
  website,
  phoneNumber,
  description,
  daysServed,
  age,
  eligibility,
  notes
) {
  return instance
    .post('/service-request', {
      userId,
      serviceType,
      orgName,
      website,
      phoneNumber,
      description,
      daysServed,
      age,
      eligibility,
      notes
    })
    .then(res => res.data)
    .catch(e => handleError(e));
}
export function callPostReferral(userId, resourceId, serviceType, serviceName) {
  return instance
    .post('/referral', {
      userId,
      resourceId,
      serviceType,
      serviceName
    })
    .then(res => res.data)
    .catch(e => handleError(e));
}
export function callMailChimp(email, name, city, research, marketing) {
  return instance
    .post('/mailchimp', {
      email,
      name,
      city,
      research,
      marketing
    })
    .then(res => res.data)
    .catch(e => handleError(e));
}
