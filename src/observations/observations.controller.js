const service = require("./observations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const observations = [];

const validSkyConditions = [100, 101, 102, 103, 104, 106, 108, 109];
const validUnits = ["C", "F"];

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "body must have data property" });
}

function hasLatitude(req, res, next) {
  const latitude = Number(req.body.data.latitude);
  if (latitude >= -90 && latitude <= 90) {
    return next();
  }
  next({ status: 400, message: "latitude must be between -90 and 90" });
}

function hasLongitude(req, res, next) {
  const longitude = Number(req.body.data.longitude);
  if (longitude >= -180 && longitude <= 180) {
    return next();
  }
  next({ status: 400, message: "longitude must be between -180 and 180" });
}

function hasSkyCondition(req, res, next) {
  const skyCondition = Number(req.body.data.sky_condition);

  if (validSkyConditions.includes(skyCondition)) {
    return next();
  }
  next({
    status: 400,
    message: `sky_condition must be one of: ${validSkyConditions}`,
  });
}

function hasTempUnits(req, res, next) {
  const tempUnits = req.body.data.air_temperature_unit;
  if (validUnits.includes(tempUnits)) {
    res.locals.units = tempUnits;
    return next();
  }
  next({
    status: 400,
    message: `air_temperature_unit must be one of: ${validUnits}`,
  });
}

function hasTemperature(req, res, next) {
  const airTemp = Number(req.body.data.air_temperature);
  if (res.locals.units === "C") {
    if (airTemp >= -50 && airTemp <= 107) {
      return next();
    }
    return next({
      status: 400,
      message: "air-temperature must be between -50 and 107",
    });
  }

  if (airTemp >= -60 && airTemp <= 224) {
    return next();
  }
  return next({
    status: 400,
    message: "air-temperature must be between -60 and 224",
  });
}

async function create(req, res) {
  /*const newObservation = req.body.data;

  const now = new Date().toISOString();
  newObservation.observation_id = nextId++;
  newObservation.created_at = now;
  newObservation.updated_at = now;

  observations.push(newObservation);*/

  const newObservation = await service.create(req.body.data);

  res.status(201).json({
    data: newObservation,
  });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

module.exports = {
  create: [
    hasData,
    hasLatitude,
    hasLongitude,
    hasSkyCondition,
    hasTempUnits,
    hasTemperature,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
};
