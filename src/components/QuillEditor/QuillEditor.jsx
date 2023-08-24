import React, { useEffect, useRef, useState } from 'react';

import 'react-quill/dist/quill.bubble.css';
import './QuillEditor.styl'
import { debounce } from 'lodash';
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ReactQuill, { Quill } from 'react-quill';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@firebase/storage';


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
  dropModule: true,
};

class DropModule {
  constructor(quill, options) {
    this.quill = quill;
    this.quill.root.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDrop(e) {
    console.log("DropModule handleDrop triggered"); // このログを追加

    e.preventDefault(); // これがデフォルトのドロップ動作をキャンセルします。
  }
}

Quill.register('modules/dropModule', DropModule);

const DEBOUNCE_DURATION = 2000; // 例: 2秒

const storage = getStorage(); // Firebase Storageへの参照

async function uploadImage(file) {
  const storageRef = ref(storage, 'gs://trading-journal-app-c4fa8.appspot.com/' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {},
      (error) => {
        reject(error);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

function MyEditor({ id, content, onContentChange, collectionName }) { // <-- contentをpropsとして受け取る
    const [editorHtml, setEditorHtml] = useState(content || ""); // <-- 初期値としてcontentを使用
    const quillRef = useRef(null);

    useEffect(() => {
        setEditorHtml(content || "");
    }, [content]);

    useEffect(() => {
        if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const container = editor.container;
    
        const dropEventListener = async (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files && files.length) {
              const file = files[0];
              if (/^image\//.test(file.type)) {
                try {
                  const imageUrl = await uploadImage(file);
                  const range = editor.getSelection();
                  if (range) {
                    editor.insertEmbed(range.index, 'image', imageUrl);
                  } else {
                    editor.insertEmbed(editor.getLength(), 'image', imageUrl);
                  }
                } catch (error) {
                  console.error("Error uploading image:", error);
                }
              }
            }
        };

        container.addEventListener('drop', dropEventListener, false);

        // ここでイベントリスナーを削除する
        return () => {
            container.removeEventListener('drop', dropEventListener, false);
        };
        }
    }, []);

  
  

  


    const debouncedAutoSave = debounce(async (html) => {
        try {
          if (id) {
            const tradeRef = doc(db, collectionName, id);
            await updateDoc(tradeRef, {
              NOTE: html,
              timestamp: Timestamp.fromDate(new Date()),
            });
          } else {
            console.error("No id provided!"); 
          }
        } catch (error) {
          console.error("Error auto-saving the note:", error);
        }
      }, DEBOUNCE_DURATION);
  
    function handleChange(html) {
        setEditorHtml(html);
        debouncedAutoSave(html);
        if (onContentChange) {
            onContentChange(html);
        }
    }

  return (
    <ReactQuill 
      theme="bubble"
      value={editorHtml}
      onChange={handleChange}
      modules={modules}
      ref={quillRef}
    />
  );
}



export default MyEditor;
