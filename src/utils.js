export const calculateAge = (dob) => {
  let dobDate = new Date(dob);
  let monthDiff = Date.now() - dobDate.getTime();
  let ageDate = new Date(monthDiff);

  let year = ageDate.getUTCFullYear();

  return Math.abs(year - 1970);
};

export const setAuthToken = (accessToken) => {
  let config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  };
  return config;
};
