const axios = require('axios');

async function simulateParallelApicall() {
  const promises = [];

  for (let i = 1; i <= 20; i++) {
    const product = axios.get(`https://fakestoreapi.com/products/${i}`);
    promises.push(product);
  }

  return Promise.all(promises);
}

async function simulatesettlePromiseCall() {
  const promises = [];

  for (let i = 1; i <= 20; i++) {
    const product = axios.get(`https://fakestoreapi.com/products/${i}`);
    promises.push(product);
  }

  return Promise.allSettled(promises);
}

async function All() {
  const apiResponse = await simulateParallelApicall();
  const externalProducts = apiResponse.map(response => response.data);
  return externalProducts;
}

async function AllSettled() {
  const apiResponse = await simulatesettlePromiseCall();
  // console.log("apiResponse", apiResponse)
  const externalProducts = apiResponse.map(response => {
    return {
      status: response.status,
      data: response?.value?.data
    }
  });
  return externalProducts;
}

// Promise.any: Returns the FIRST FULFILLED promise
// Ignores errors unless ALL fail.
async function Any() {
  const p1 = new Promise((_, reject) => setTimeout(() => reject('Fail 1'), 100));
  const p2 = new Promise((resolve) => setTimeout(() => resolve('Success 2 (Any)'), 200));
  const p3 = new Promise((resolve) => setTimeout(() => resolve('Success 3'), 300));

  try {
    return await Promise.any([p1, p2, p3]);
  } catch (e) {
    return e;
  }
}

// Promise.race: Returns the FIRST SETTLED promise (Success OR Failure)
async function Race() {
  const p1 = new Promise((_, reject) => setTimeout(() => reject('Fail 1 (Race)'), 100)); // Wins because it's fastest
  const p2 = new Promise((resolve) => setTimeout(() => resolve('Success 2'), 200));

  try {
    return await Promise.race([p1, p2]);
  } catch (e) {
    return `Race Caught Error: ${e}`;
  }
}

exports.getData = async (req, res) => {
  try {
    // 1. Parallel API call
    // const promiseAllData = await All();
    // console.log("promiseAllData", promiseAllData);

    const promiseAllSettledData = await AllSettled();
    console.log("promiseAllSettledData", promiseAllSettledData);

    const anyResult = await Any();
    const raceResult = await Race();

    res.status(200).json({
      status: 'success',
      source: 'Internal + External API',
      externalDataCount: promiseAllSettledData.length,
      externalData: promiseAllSettledData,
      anyDemo: anyResult,
      raceDemo: raceResult,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch data',
      error: error.message
    });
  }
};

exports.createData = (req, res) => {
  console.log('Received data:', req.body);

  res.status(201).json({
    status: 'success',
    message: 'Data received successfully',
    data: req.body
  });
};
