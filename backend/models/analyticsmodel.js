import mongoose from 'mongoose';

const CategoryCountSchema = new mongoose.Schema({
  category: { type: String, required: true },
  count: { type: Number, required: true }
}, { _id: false });

const analyticsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: function () {
      return this.type === 'subscribe';
    }
  },
  dp:{
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  totalSubscriptions: {
    type: Number,
    required: true
  },
  topCategory: {
    type: String,
    required: true
  },
  categoryCounts: {
    type: [CategoryCountSchema],
    required: true
  },
  type: {
    type: String,
    enum: ['subscribe', 'unsubscribe'],
    default: 'subscribe'
  },
  unsubscribedChannels: [{
    title: { type: String, required: true },
    dp: { type: String }
  }]

});

export default mongoose.model('Analytics', analyticsSchema);
