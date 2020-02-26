import React, { useState, useMemo, useEffect } from 'react';
import { createEditor, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

const TextInputBox = ({ messagesApi, user }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [newMessage, setNewMessage] = useState([ { children: [ { text: '' } ] } ]);

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
      <Slate editor={editor} value={newMessage} onChange={value => {
          setNewMessage(value);
        }}>
        <Editable placeholder="Message #channel" onKeyPress={onKeyPress} />
      </Slate>
      <button onClick={onSubmit}>Send</button>
    </div>
  );
}

export default TextInputBox;