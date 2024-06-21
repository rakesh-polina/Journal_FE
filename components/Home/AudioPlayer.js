import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioPlayer = ({ recordedAudio, onDeleteRecordedAudio }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPositionSec, setCurrentPositionSec] = useState(0);
    const [currentDurationSec, setCurrentDurationSec] = useState(0);

    const togglePlayPause = async () => {
        if (isPlaying) {
            try {
                await audioRecorderPlayer.pausePlayer();
                console.log('Playback paused');
            } catch (err) {
                console.error('Failed to pause playback:', err);
            }
        } else {
            try {
                if (recordedAudio) {
                    console.log('onStartPlay');
                    const msg = await audioRecorderPlayer.startPlayer(recordedAudio);
                    console.log('Playing: ', msg);
                    audioRecorderPlayer.addPlayBackListener((e) => {
                        setCurrentPositionSec(e.currentPosition);
                        setCurrentDurationSec(e.duration);
                    });
                }
            } catch (err) {
                console.error('Failed to start playing:', err);
            }
        }
        setIsPlaying(!isPlaying);
    };
  
    const formatTime = (sec) => {
        const minute = Math.floor(sec / 60);
        const secondLeft = Math.floor(sec - minute * 60);
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    };

    return (
        <View style={styles.audioControl}>
            <Icon
                name={isPlaying ? "pause" : "play-arrow"}
                size={24}
                color="#FFF"
                onPress={togglePlayPause}
                style={styles.playPauseIcon}
            />
            <View style={styles.sliderContainer}>
                <Text style={styles.timeStamp}>{formatTime(currentPositionSec / 1000)}</Text>
                <Slider
                    style={styles.slider}
                    maximumValue={currentDurationSec}
                    value={currentPositionSec}
                    onValueChange={val => setCurrentPositionSec(val)}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#FFF"
                />
                <Text style={styles.timeStamp}>{formatTime(currentDurationSec / 1000)}</Text>
            </View>
            <Icon name="delete" size={24} color="red" onPress={onDeleteRecordedAudio} style={styles.deleteIcon} />
        </View>
    );
};

const styles = StyleSheet.create({
    audioControl: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
        backgroundColor: '#000',
        padding: 10,
    },
    playPauseIcon: {
        marginLeft: 10,
    },
    deleteIcon: {
        marginLeft: 20,
    },
    sliderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    slider: {
        flex: 1,
    },
    timeStamp: {
        color: '#fff',
        marginHorizontal: 5,
    },
});

export default AudioPlayer;
