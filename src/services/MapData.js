const countryInfo = require("./country.json");

const arrangeCountryInfo = () => {
  const countries = {};
  const list = [];
  countryInfo.hits.hits.map((item) => {
    if (!countries[item._source.Country]) {
      countries[item._source.Country] = {
        sources: [item._source],
      };
    } else {
      countries[item._source.Country].sources = arraySourceByDate(
        countries[item._source.Country].sources,
        item._source
      );
    }
  });
  return countries;
};

function arraySourceByDate(currentSources = [], newSource) {
  for (let i = 0; i < currentSources.length; i++) {
    if (currentSources[i].Date > newSource.Date) {
      currentSources.splice(i, 0, newSource);
      return currentSources;
    }
  }
  currentSources.splice(currentSources.length - 1, 0, newSource);
  return currentSources;
}

export default arrangeCountryInfo;
