// Importing required modules
const fs = require('fs'); // File system module to read files
const path = require('path'); // Path module to work with file paths

// Function to get all games
const getAllGames = (req, res) => {

    try {
        // Define the path to the JSON file that contains game data
        const filePath = path.join(__dirname, '../data/game-data.json');
        
        // Read the JSON file and parse it into a JavaScript object
        const gamesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Process the game data to include a thumbnail, either from the game data or a default dummy image
        const gamesWithThumbnail = gamesData.map(game => {
            // Check if the game has a thumbnail, and if it does, extract its URL
            const thumb = game.thumb && game.thumb.url
                ? game.thumb // If thumbnail exists, use it
                : { url: '//dummyimage.com/280x280/4438f0/fff.png&text=' + (game.title || 'Unknown Title').replace(/\s/g, '+') }; // Default dummy image if no thumbnail exists

            // Return the game object with the updated thumb property
            return {...game, thumb};
        });

        // Check if there is a search query parameter in the request
        const { search } = req.query;
        if(search){
            // Filter the games based on the search term (case-insensitive match on title or provider name)
            const filteredGames = gamesWithThumbnail.filter(game => 
                game.title.toLowerCase().includes(search.toLowerCase()) || 
                game.providerName.toLowerCase().includes(search.toLowerCase())
            );
            // Return the filtered games as a JSON response
            return res.json(filteredGames);
        };

        // If no search query is present, return all games with thumbnails
        res.json(gamesWithThumbnail);

    } catch (error) {
        // Log any errors that occur while reading or processing the file
        console.error('Error reading file', error);
        // Send an error response if an exception occurs
        res.status(500).send('Internal Server Error');
    };

};

// Export the function so it can be used elsewhere in the application
module.exports = { getAllGames };
