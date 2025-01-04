const fleetManagerModel = require("../models/fleetManagerModel");

const getFMByState = async (state, query) => {
  try {
    const { page, limit } = query;
    const fleetManagers = await fleetManagerModel.paginate(
      { state: state },
      { page, limit, sort: { createdAt: -1 } }
    );
    return fleetManagers;
  } catch (error) {
    throw new Error(`Error getting fleet managers: ${error.message}`);
  }
};

module.exports = { getFMByState };
