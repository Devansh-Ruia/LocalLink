import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message, User } from '../types';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
}

export default function MessageBubble({ message, currentUser }: MessageBubbleProps) {
  const isOwnMessage = message.senderId === currentUser.id;

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.senderName,
        isOwnMessage ? styles.ownSenderName : styles.otherSenderName
      ]}>
        {message.sender.name}
      </Text>
      <View style={[
        styles.bubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {message.text}
        </Text>
      </View>
      <Text style={[
        styles.timestamp,
        isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
      ]}>
        {new Date(message.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  ownSenderName: {
    color: '#666',
    textAlign: 'right',
  },
  otherSenderName: {
    color: '#264653',
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: '100%',
  },
  ownBubble: {
    backgroundColor: '#2A9D8F',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E0E0E0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#264653',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
  },
  ownTimestamp: {
    color: '#666',
  },
  otherTimestamp: {
    color: '#666',
  },
});
