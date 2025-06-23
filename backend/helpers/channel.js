import { assignCategoryByPriority } from "./categorise.js";
export default class Channel {
  constructor(apiData, category = 'Uncategorized',subscribedAt= null) {
    this.channelId = apiData.id;
    this.title = apiData.snippet.title;
    this.description = apiData.snippet.description;
    this.customUrl = apiData.snippet.customUrl;
    this.subscribeAt = subscribedAt ? new Date(subscribedAt) : null;
    this.country = apiData.snippet.country;
    this.keywords = (apiData.brandingSettings?.channel?.keywords || '').split(' '); //check formatting
    this.categories = ((apiData.topicDetails?.topicCategories || [])
    .map(url =>decodeURIComponent(url.split('/').pop().replace(/_/g, ' ')))).sort();
    this.banner = apiData.brandingSettings?.image?.bannerExternalUrl || null;
    this.profilephoto= apiData.snippet.thumbnails?.default?.url || null; //default | medium | high
    this.subscriberCount = parseInt(apiData.statistics?.subscriberCount || 0,10);
    this.viewCount = parseInt(apiData.statistics?.viewCount || 0,10);
    this.videoCount = parseInt(apiData.statistics?.videoCount || 0,10);
    this.category = assignCategoryByPriority(this.categories);
  }
}
