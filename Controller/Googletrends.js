const googleTrends = require('google-trends-api');



const getTrendingSearches = async (req, res) => {
    googleTrends.dailyTrends({
        geo: 'US', // Change 'US' to 'IN' for India or any other country code
    })
    .then((results) => {
        // console.log('Trending Searches:', JSON.parse(results).default.trendingSearchesDays[0].trendingSearches);
        res.status(200).send(JSON.parse(results).default.trendingSearchesDays[0].trendingSearches)
    })
    .catch((err) => {
        console.error('Error fetching trending searches:', err);
    });
}

module.exports = {getTrendingSearches}
