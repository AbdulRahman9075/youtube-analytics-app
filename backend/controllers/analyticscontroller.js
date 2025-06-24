import Analytics from '../models/analyticsmodel.js';


const sortBySubscribedAt = (arr)=>{
  return arr.slice().sort((a, b) =>  a.subscribeAt - b.subscribeAt);
}
//test comment
// Count channel Categories
const calculateCategoryCounts = (channelArray)=> {
  const categoryCounts = {};

  for (const channel of channelArray) {
    const category = channel.category;

    if (category in categoryCounts) {
      categoryCounts[category]++;
    } else {
      categoryCounts[category] = 1;
    }
  }
  return categoryCounts;
}

// Count Highest Category
const getHighestCategory = (countsarray) => {
  if (!countsarray || typeof countsarray !== 'object' || Object.keys(countsarray).length === 0) {
    throw new Error("Invalid or empty input: countsarray must be a non-empty object.");
  }

  let maxCategory = null;
  let maxCount = -Infinity;

  for (const [category, count] of Object.entries(countsarray)) {
    if (count > maxCount) {
      maxCount = count;
      maxCategory = category;
    }
  }

  return { category: maxCategory, count: maxCount };
};

const processNewChannels = async (currentChannels, previousChannels) => {

  const sortedCurrent = sortBySubscribedAt(currentChannels);
  const sortedPrevious = sortBySubscribedAt(previousChannels);

  const latestPrevDate = sortedPrevious.length
    ? sortedPrevious[sortedPrevious.length - 1].subscribeAt
    : new Date(0);

  // Log the subscribe dates in current state
  console.log("SubscribedAt dates in currentChannels:");
  for (const ch of sortedCurrent) {
    console.log(ch.title, "→", ch.subscribeAt.toISOString());
  }

  const newChannels = sortedCurrent.filter(ch =>
      ch.subscribeAt > latestPrevDate
  );

  console.log(`SUBSCRIBED: ${newChannels.length} new channels`);

  // ---Handle new subscriptions ---
  for (const newCh of newChannels) {
    const relevantChannels = sortedCurrent.filter(ch =>
      ch.subscribeAt <= newCh.subscribeAt
    );
    
    const totalSubscriptions = relevantChannels.length;
    const categoryCounts = calculateCategoryCounts(relevantChannels);
    const topCategory = getHighestCategory(categoryCounts);

    console.log("Preparing snapshot:");
    console.log("Date:", newCh.subscribeAt);
    console.log("Total subscriptions:", totalSubscriptions);
    console.log("Top category:", topCategory);
    console.log("Category breakdown:", categoryCounts);

    const snapshot = new Analytics({
      title: newCh.title,
      dp: newCh.profilephoto,
      date: newCh.subscribeAt,
      totalSubscriptions,
      topCategory: topCategory.category,
      categoryCounts: Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count
      }))
    });

    await snapshot.save();
    console.log(`SUCCESS: Snapshot saved for new subscription at: ${newCh.subscribeAt}`);
  }

  // --- Handle unsubscribes ---
  const previousIds = new Set(previousChannels.map(ch => ch.channelId));
  const currentIds = new Set(currentChannels.map(ch => ch.channelId));

  const unsubscribed = [...previousIds].filter(id => !currentIds.has(id));
  const unsubscribedChannelObjects = previousChannels.filter(ch =>
  unsubscribed.includes(ch.channelId)
  );
  console.log(`UNSUBSCRIBED: ${unsubscribed.length} old channels`);
  const unsubscribedData = unsubscribedChannelObjects.map(ch => ({
  title: ch.title,
  dp: ch.profilephoto
  }));
  if (unsubscribed.length > 0) {
    const totalSubscriptions = currentChannels.length;
    const categoryCounts = calculateCategoryCounts(currentChannels);
    const topCategory = getHighestCategory(categoryCounts);
    console.log("Preparing snapshot:");
    console.log("Total unsubscriptions:", unsubscribed.length,unsubscribedChannelObjects.length);
    console.log("Top category:", topCategory);
    console.log("Category breakdown:", categoryCounts);

    const snapshot = new Analytics({
      date: new Date(), // timestamp of this fetch (unsub detection time)
      totalSubscriptions,
      topCategory: topCategory.category,
      categoryCounts: Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count
      })),
      type: 'unsubscribe',
      unsubscribedChannels: unsubscribedData
    });

    await snapshot.save();

    console.log(`SUCCESS: Saved snapshot for unsubscribe(s) detected at: ${snapshot.date}`);
  }
}

export {sortBySubscribedAt,calculateCategoryCounts,getHighestCategory,processNewChannels}