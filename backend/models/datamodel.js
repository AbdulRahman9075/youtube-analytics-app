import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  customUrl: String,
  subscribeAt: Date,
  country: String,
  keywords: [String],
  categories: [String], // from topicDetails.topicCategories
  banner: String,
  profilephoto: String, // corresponds to default thumbnail
  subscriberCount: Number,
  viewCount: Number,
  videoCount: Number,
  category: { type: String, default: 'Uncategorized' },
}, { timestamps: true });


const SubscriptionsSchema = new mongoose.Schema({
  channels: [ChannelSchema]
}, { timestamps: true });

export default mongoose.model('Subscriptions', SubscriptionsSchema);
