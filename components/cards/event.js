import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import theme from '../../styles/theme';
import FastImage from 'react-native-fast-image';

const Event = ({ event, onEdit, onDelete }) => {
  const getMoodDetails = (moodIndex) => {
    const moodDetails = [
      { source: require('../../assets/icons/angry.png'), selectedColor: theme.error },
      { source: require('../../assets/icons/sad.png'), selectedColor: theme.warning },
      { source: require('../../assets/icons/smile.png'), selectedColor: theme.primary },
      { source: require('../../assets/icons/happy.png'), selectedColor: '#F1C40F' },
      { source: require('../../assets/icons/heart.png'), selectedColor: '#F08080' },
    ];

    return moodDetails[moodIndex] || moodDetails[0];
  };

  const { source, selectedColor } = getMoodDetails(event.mood);

  const renderThumbnails = (media) => {
    const images = media.slice(0, 5).map((item, index) => {
      const isVideo = item.includes('.mp4'); // Assuming video files have '.mp4' extension
      return (
        <View key={index} style={getContainerStyle(index, media.length)}>
          {isVideo ? (
            <View style={getImageStyle(index, media.length)}>
              <FastImage
                source={{ uri: item }}
                style={styles.thumbnailImage}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Image source={require('../../assets/icons/play.png')} style={styles.playIcon} />
            </View>
          ) : (
            <FastImage
              source={{ uri: item }}
              style={getImageStyle(index, media.length)}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        </View>
      );
    });

    if (media.length > 5) {
      images[4] = (
        <View style={styles.rightBottomRightQuarterContainer} key={4}>
          <FastImage source={{ uri: media[4] }} style={styles.thumbnailImage} />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>+{media.length - 5}</Text>
          </View>
        </View>
      );
    }

    return images;
  };
  

  const getContainerStyle = (index, length) => {
    if (length === 1) {
      return styles.fullContainer;
    } else if (length === 2) {
      if (index === 0) return styles.leftHalfContainer;
      if (index === 1) return styles.rightHalfContainer;
    } else if (length === 3) {
      if (index === 0) return styles.leftHalfContainer;
      if (index === 1) return styles.topRightQuarterContainer;
      if (index === 2) return styles.bottomRightQuarterContainer;
    } else if (length === 4) {
      if (index === 0) return styles.leftHalfContainer;
      if (index === 1) return styles.topRightQuarterContainer;
      if (index === 2) return styles.leftBottomRightQuarterContainer;
      if (index === 3) return styles.rightBottomRightQuarterContainer;
    } else if (length === 5) {
      if (index === 0) return styles.leftHalfContainer;
      if (index === 1) return styles.leftTopRightQuarterContainer;
      if (index === 2) return styles.rightTopRightQuarterContainer;
      if (index === 3) return styles.leftBottomRightQuarterContainer;
      if (index === 4) return styles.rightBottomRightQuarterContainer;
    } else {
      if (index === 0) return styles.leftHalfContainer;
      if (index === 1) return styles.leftTopRightQuarterContainer;
      if (index === 2) return styles.rightTopRightQuarterContainer;
      if (index === 3) return styles.leftBottomRightQuarterContainer;
      if (index === 4) return styles.rightBottomRightQuarterContainer;
    }
  };
  

  const getImageStyle = (index, length) => {
    return styles.image;
  };

  const mediaItems = [...event.media.image, ...event.media.video];

  return (
    <View style={styles.card}>
      {mediaItems.length > 0 && (
        <View style={styles.mediaContainer}>
          {renderThumbnails(mediaItems)}
        </View>
      )}
      <View style={[styles.footer, mediaItems.length > 0 && styles.footerWithMedia]}>
        {event.bookmark ? (
          <Image source={require('../../assets/icons/bookmark.png')} tintColor={theme.primary} style={styles.bookmark} />
        ) : null}
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(event._id)}>
          <Image source={require('../../assets/icons/cross_2.png')} style={{ width: 23, height: 23, tintColor: theme.error }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editableArea} onPress={() => onEdit(event)}>
          <Text style={styles.note} numberOfLines={2} ellipsizeMode="tail">
            {event.title}
          </Text>
          <View style={styles.header}>
            <Text style={styles.location}>{event.location}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.moodIndicator}>
          <Image source={source} style={{ width: 25, height: 25, tintColor: selectedColor }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.greyLight,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  mediaContainer: {
    height: 200,
    backgroundColor: theme.greyLight,
    position: 'relative',
  },
  fullContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topHalfContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  bottomHalfContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  leftHalfContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50%',
  },
  rightHalfContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50%',
  },
  topRightQuarterContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '50%',
  },
  bottomRightQuarterContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: '50%',
  },
  topLeftQuarterContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '25%',
    height: '50%',
  },
  bottomLeftQuarterContainer: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: '25%',
    height: '50%',
  },
  leftBottomRightQuarterContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    width: '25%',
    height: '50%',
  },
  rightBottomRightQuarterContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '25%',
    height: '50%',
  },
  leftTopRightQuarterContainer: {
    position: 'absolute',
    left: '50%',
    top: 0,
    width: '25%',
    height: '50%',
  },
  rightTopRightQuarterContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '25%',
    height: '50%',
  },
  quarterContainer: {
    position: 'absolute',
    width: '50%',
    height: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  thumbnail5: {
    width: '50%',
    height: '50%',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  overlayText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: theme.greyLight,
    padding: 10,
  },
  footerWithMedia: {
    paddingTop: 0,
  },
  editableArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    color: theme.secondaryText,
    fontSize: 12,
  },
  note: {
    color: theme.primaryText,
    fontSize: 24,
    marginVertical: 10,
    paddingRight: 50,
  },
  moodIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  bookmark: {
    height: 20,
    width: 20,
    position: 'absolute',
    top: 5,
    right: 25,
  },
  deleteButton: {
    height: 20,
    width: 20,
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 99,
  },
  playIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    tintColor: '#fff',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -20 }],
  },
});


export default Event;