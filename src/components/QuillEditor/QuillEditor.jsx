import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import './QuillEditor.styl'
import { debounce } from 'lodash';
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
};
const DEBOUNCE_DURATION = 2000; // 例: 2秒


function MyEditor({ tradeId, content, onContentChange }) { // <-- contentをpropsとして受け取る
  const [editorHtml, setEditorHtml] = useState(content || ""); // <-- 初期値としてcontentを使用

  useEffect(() => {
    setEditorHtml(content || "");
  }, [content]);

  const debouncedAutoSave = debounce(async (html) => { // <-- htmlを引数として受け取る
    try {
      if (tradeId) {
        const tradeRef = doc(db, "journal", tradeId);
        await updateDoc(tradeRef, {
          NOTE: html, // <-- 引数として渡されたhtmlを使用
          timestamp: Timestamp.fromDate(new Date()),
        });
      } else {
        console.error("No tradeId provided!"); 
      }
    } catch (error) {
      console.error("Error auto-saving the note:", error);
    }
  }, DEBOUNCE_DURATION);
  
  function handleChange(html) {
    setEditorHtml(html);
    console.log('editorHtml', editorHtml)
    debouncedAutoSave(html); // <-- htmlをdebouncedAutoSaveへ渡す
    if (onContentChange) {
      onContentChange(html);  // 親コンポーネントに変更を伝える
    }
  }

  return (
    <ReactQuill 
      theme="bubble"
      value={editorHtml}
      onChange={handleChange}
      modules={modules}
    />
  );
}



export default MyEditor;
