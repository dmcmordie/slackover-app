import React, { useState, useMemo, useEffect } from 'react';
import { createEditor, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import Picker from 'emoji-picker-react';
import copy from 'copy-to-clipboard';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const TextInputBox = ({ messagesApi, user }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [newMessage, setNewMessage] = useState([ { children: [ { text: '' } ] } ]);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
 
    const onEmojiClick = (event, emojiObject) => {
        copy(emojiObject.emoji);
        NotificationManager.info('Emoji copied to clipboard');
    }

  /**
   * Parse the text provided by the input and send to the Firestore. Once the message has been sent, we can reset 
   * the message state so it's unlikely the users can repeat sending the same message.
   * 
   * @param {Event} e 
   */
  const onSubmit = (e) => {
    if (e) {
        e.preventDefault();
    }

    const text = parseText(newMessage);

    // Add the message to the database
    messagesApi.add({ message: text, createdAt: new Date(), userId: user.uid, sentBy: user.displayName, channelName: 'general' });

    // ... then we can reset state
    setNewMessage([ { children: [ { text: '' } ] } ]);
  }

  /**
   * Since messages can have multiple paragraphs, return a joined string.
   * 
   * @param nodes 
   */
  const parseText = (nodes) => {
    return nodes.map(n => Node.string(n)).join('\n')
  }

  const onKeyPress = (e) => {

        if(e.charCode === 13) {
            e.preventDefault();
            const text = parseText(newMessage);

            // Add the message to the database
            messagesApi.add({ message: text, createdAt: new Date(), userId: user.uid, sentBy: user.displayName, channelName: 'general' });
        }
  }

  return (
    <div className={`textInput`}>
    <NotificationContainer />
      <Slate editor={editor} value={newMessage} onChange={value => {
          setNewMessage(value);
        }}>
        <Editable placeholder="Message #channel" />
      </Slate>
      <button onClick={onSubmit}>Send</button>
      <button onClick={() => setShowEmoji(!showEmoji)}>Emoji Picker</button>
      { showEmoji ? <Picker onEmojiClick={onEmojiClick}/> : null }
    </div>
  );
}

export default TextInputBox;