const linkColor = '#efbac5';
const linkHoverColor = '#eaa3b2';
const linkActiveColor = '#e0758c';

let backendDomain;
if(process.env.REACT_APP_ISPRODUCTION === '1'){
  backendDomain = process.env.REACT_APP_API_BASE_DEV;
}
else{
  backendDomain = process.env.REACT_APP_API_BASE_DEP;
}

const CATEGORY_LIST = [
  "Music",
  "Gaming",
  "Science & Technology",
  "Entertainment",
  "Sports",
  "Lifestyle & Health",
  "Food & Drink",
  "Travel & Tourism",
  "Fashion",
  "Vehicles",
  "Education",
  "News & Politics",
  "Business",
  "Religion",
  "Military"
];
const CATEGORY_COLORMAP_LIGHT = {
  "Music": 'green', //darkgreen
  "Gaming": 'purple',                    
  "Science & Technology": 'red', 
  "Entertainment":'orange',               
  "Sports": 'brown', //redishbrown
  "Lifestyle & Health": '#1ec0ed', //lightblue
  "Food & Drink": 'pink',
  "Travel & Tourism": '#78f06f', //lightgreen
  "Fashion":'#846e84', //lightpurple
  "Vehicles": '#5f4238', //brown
  "Education": 'blue',               
  "News & Politics": '#6082b6', //dullblue
  "Business": '#666666',  //grey
  "Religion": '#1a1a49', //navyblue
  "Military": '#b2b2b2', //lightgrey
  "Uncategorized": 'black'
};

export default {linkColor,linkActiveColor,linkHoverColor,CATEGORY_LIST,CATEGORY_COLORMAP_LIGHT,backendDomain}