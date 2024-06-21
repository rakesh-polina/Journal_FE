import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet, Text } from 'react-native';
import Video from 'react-native-video';

const MediaDisplay = ({ media, onRemove }) => {
  console.log('media is ', media)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleMediaPress = (item) => {
    setSelectedMedia(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedia(null);
  };

  const determineType = (uri) => {
    if (uri.endsWith('.mp4')) {
      return 'video/mp4';
    }
    if (uri.endsWith('.jpg') || uri.endsWith('.jpeg') || uri.endsWith('.png')) {
      return 'image/jpeg';
    }
    return 'unknown';
  };

  return (
    <View>
      <View style={styles.mediaContainer}>
        {media.map((uri, index) => {
          const type = determineType(uri);
          return (
            <View key={index} style={styles.mediaItemContainer}>
              <TouchableOpacity onPress={() => handleMediaPress({ type, uri })}>
                {type === 'video/mp4' ? (
                  <Video
                    source={{ uri }}
                    style={styles.mediaItem}
                    paused={true} // Ensures the video is not playing in the list
                  />
                ) : (
                  <Image
                    source={{ uri }}
                    style={styles.mediaItem}
                    onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
                  />
                )}
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
            {selectedMedia.type === 'video/mp4' ? (
              <Video
                source={{ uri: selectedMedia.uri }}
                style={styles.modalMedia}
                controls={true}
                resizeMode="contain"
              />
            ) : (
              <Image source={{ uri: selectedMedia.uri }} style={styles.modalMedia} />
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