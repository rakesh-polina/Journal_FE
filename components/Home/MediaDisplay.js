import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';

const MediaDisplay = ({ media, onRemove }) => {
  console.log('media is ', media);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleMediaPress = (item) => {
    setSelectedMedia(item);
    setModalVisible(true);
    setLoading(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedia(null);
  };

  const handleLoad = () => {
    setLoading(false); // Hide loader when media is loaded
  };

  return (
    <View>
      <View style={styles.mediaContainer}>
        {media.map((item, index) => {
          const { type, uri } = item;
          return (
            <View key={index} style={styles.mediaItemContainer}>
              <TouchableOpacity onPress={() => handleMediaPress(item)}>
                {type === 'video/mp4' ? (
                  <Video
                    source={{ uri }}
                    style={styles.mediaItem}
                    paused={true} // Ensures the video is not playing in the list
                    onError={(error) => console.error('Error loading video:', error)}
                    onLoad={handleLoad}
                  />
                ) : (
                  <Image
                    source={{ uri }}
                    style={styles.mediaItem}
                    onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
                    onLoad={handleLoad}
                  />
                )}
                {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(index)}
              >
                <Image
                  source={require('../../assets/icons/cross.png')}
                  style={styles.removeIcon}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {selectedMedia && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
            {selectedMedia.type === 'video/mp4' ? (
              <Video
                source={{ uri: selectedMedia.uri }}
                style={styles.modalMedia}
                controls={true}
                resizeMode="contain"
                onError={(error) => console.error('Error loading video:', error)}
                onLoad={handleLoad}
              />
            ) : (
              <Image
                source={{ uri: selectedMedia.uri }}
                style={styles.modalMedia}
                onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
                onLoad={handleLoad}
              />
            )}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mediaItemContainer: {
    position: 'relative',
    margin: 5,
  },
  mediaItem: {
    width: 100,
    height: 100,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
  },
  removeIcon: {
    width: 15,
    height: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMedia: {
    width: '100%',
    height: '50%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default MediaDisplay;