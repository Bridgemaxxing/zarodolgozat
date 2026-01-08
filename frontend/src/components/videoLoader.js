const videoCache = {};

export const preloadVideo = async (url) => {
  if (videoCache[url]) return videoCache[url];
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    videoCache[url] = blobUrl;
    return blobUrl;
  } catch (error) {
    return url; 
  }
};