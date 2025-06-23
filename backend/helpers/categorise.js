import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//assign categories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct absolute path to topicCategories.json
const categoryMapPath = path.resolve(__dirname, '../topicCategories.json');

const raw = JSON.parse(fs.readFileSync(categoryMapPath, 'utf8'));

// Flattened map: childWord => parentCategory
const childToParentMap = {};
for (const [parent, children] of Object.entries(raw)) {
    for (const child of children) {
    childToParentMap[child] = parent;
    }
}

// Priority list of child topic words
const CHILD_PRIORITY = [
    "History",
    "Society",
    "Music",
    "Christian music",
    "Hip hop",
    "Classical music",
    "Rock music",
    "Country music",
    "Electronic music",
    "Reggae",
    "Pop music",
    "Jazz",
    "Gaming",
    "Action game",
    "Role-playing game",
    "Strategy video game",
    "Shooter game",
    "Puzzle game",
    "Racing video game",
    "Sports game",
    "Science",
    "Science and Technology",
    "Technology",
    "Humor",
    "Movies",
    "Performing arts",
    "TV shows",
    "Film",
    "Sports",
    "Baseball",
    "Basketball",
    "Boxing",
    "Cricket",
    "Football",
    "Golf",
    "Ice hockey",
    "Motorsport",
    "Tennis",
    "Volleyball",
    "Professional wrestling",
    "Health",
    "Fitness",
    "Pets",
    "Lifestyle",
    "Beauty",
    "Food", //
    "Tourism",
    "Fashion",
    "Vehicles",
    "Politics",
    "News",
    "Business",
    "Religion",
    "Military",
    "Knowledge",

  ];


/**
 * Assigns category based on the highest priority child word in a channel's categories.
 * @param {string[]} topicWords - The channel.categories array (topic names, not URLs).
 * @returns {string} - Parent category or 'Uncategorized'.
 */
function assignCategoryByPriority(topicWords) {
    for (const child of CHILD_PRIORITY) {
    if (topicWords.includes(child)) {
        return childToParentMap[child] || 'Uncategorized';
    }
    }
    return 'Uncategorized';
}

export {assignCategoryByPriority};