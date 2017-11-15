import calculateChart from './calculateChart';

module.exports = async () => {

    await Promise.all([
        calculateChart.start(),
    ]);
};
