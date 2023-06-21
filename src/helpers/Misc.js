export const isNumber = (val) => {
  return /^[0-9]*$/.exec(val) != null;
};

export const addLocationChangeListener = (func) => {
  let currentLocation = window.location.pathname;

  const checkLocation = () => {
    const newLocation = window.location.pathname;

    if (currentLocation !== newLocation) {
      currentLocation = newLocation;
      func(currentLocation);
    }

    setTimeout(checkLocation, 500);
  }

  checkLocation();
};