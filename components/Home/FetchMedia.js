import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Exif from 'react-native-exif';
import { parseISO, isSameDay, format } from 'date-fns';
import { launchImageLibrary } from 'react-native-image-picker';

const parseCustomDate = (dateString) => {
  if (!dateString) return null;
  // Convert from "YYYY:MM:DD HH:mm:ss" to "YYYY-MM-DDTHH:mm:ss"
  return dateString.replace(/:/g, '-').replace(' ', 'T');
};

const parseLocation = (coordinateString) => {
  if (!coordinateString) return null;
  // Convert from "0/1,0/1,0/1" to a valid number
  const parts = coordinateString.split(',');
  if (parts.length === 3) {
    const degrees = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]) / 60;
    const seconds = parseFloat(parts[2]) / 3600;
    return degrees + minutes + seconds;
  }
  return null;
};

const fetchMedia = async () => {
  try {
    console.log('Accessing Camera Roll');
    const media = await CameraRoll.getPhotos({
      first: 50, // Number of items to fetch
      assetType: 'All', // Can be 'Photos', 'Videos' or 'All'
    });
    console.log('Media fetched from Camera Roll:', media);

    const items = await Promise.all(
      media.edges.map(async (edge) => {
        const { node } = edge;
        try {
          const metadata = await Exif.getExif(node.image.uri);
          console.log('Metadata extracted:', metadata);

          return {
            uri: node.image.uri,
            date: parseCustomDate(metadata.exif.DateTime) || null,
            location: {
              latitude: parseLocation(metadata.exif.GPSLatitude) || null,
              longitude: parseLocation(metadata.exif.GPSLongitude) || null,
            },
          };
        } catch (error) {
          console.error('Error extracting metadata:', error);

          return {
            uri: node.image.uri,
            date: null,
            location: {
              latitude: null,
              longitude: null,
            },
          };
        }
      })
    );

    return items;
  } catch (error) {
    console.error('Error accessing Camera Roll:', error);
    return [];
  }
};



const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => x * Math.PI / 180;
  const R = 6371; // Radius of the Earth in km

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// const clusterByDateAndLocation = (items, maxDistance) => {
//   const clusters = [];
//   console.log('into clustering')
//   items.forEach(item => {
//     let foundCluster = false;
//     console.log(foundCluster)
//     clusters.forEach(cluster => {
//       console.log('something')
//       const sameDay = isSameDay(parseISO(cluster.date), parseISO(item.date));
//       console.log("sameDay")
//       const closeBy = haversineDistance(cluster.location, item.location) <= maxDistance;
//       console.log(sameDay)
//       if (sameDay && closeBy) {
//         cluster.items.push(item);
//         foundCluster = true;
//       }
//     });

//     if (!foundCluster) {
//       clusters.push({
//         date: item.date,
//         location: item.location,
//         items: [item]
//       });
//       console.log(clusters)
//     }
//   });
//   console.log(clusters)
//   return clusters;
// };



const clusterByDateAndLocation = (items, maxDistance) => {
  const clusters = [];
  console.log('Starting clustering process with maxDistance:', maxDistance);

  items.forEach((item, itemIndex) => {
    let foundCluster = false;
    // console.log(`Processing item ${itemIndex + 1}/${items.length}`, item);

    clusters.forEach((cluster, clusterIndex) => {
      // console.log(`Checking against cluster ${clusterIndex + 1}/${clusters.length}`, cluster);

      // Parse dates safely and handle undefined dates
      const itemDate = item.date ? parseISO(item.date) : null;
      const clusterDate = cluster.date ? parseISO(cluster.date) : null;

      if (!itemDate || !clusterDate) {
        // console.log('Skipping comparison due to undefined date:', { itemDate, clusterDate });
        return;
      }

      const sameDay = isSameDay(clusterDate, itemDate);
      const closeBy = haversineDistance(cluster.location, item.location) <= maxDistance;

      // console.log(`Same day: ${sameDay}, Close by: ${closeBy}`);

      if (sameDay && closeBy) {
        cluster.items.push(item);
        foundCluster = true;
      }
    });

    if (!foundCluster) {
      clusters.push({
        date: item.date,
        location: item.location,
        items: [item]
      });
      // console.log('Created new cluster:', clusters[clusters.length - 1]);
    }
  });

  // console.log('Final clusters:', clusters);
  return clusters;
};


module.exports = {fetchMedia, haversineDistance, clusterByDateAndLocation};