import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import 'react-quill/dist/quill.bubble.css';
import './QuillEditor.styl';
import { debounce } from 'lodash';
import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ReactQuill, { Quill } from 'react-quill';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@firebase/storage';
import { ImageDrop } from 'quill-image-drop-module';

async function fetchNotesFromFirestore(dbCollection, id) {
    if (!id) {
      console.error("No id provided for fetching notes!");
      return "";
    }
  
    try {
      const docRef = doc(db, dbCollection, id);
      const docData = await getDoc(docRef);
  
      if (docData.exists()) {
        return docData.data().NOTES || "";
      } else {
        console.error("No document found with given id:", id);
        return "";
      }
    } catch (error) {
      console.error("Error fetching the note:", error);
      return "";
    }
}

function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

  
const DEBOUNCE_DURATION = 2000; 

Quill.register('modules/imageDrop', ImageDrop);

const modules = {
    toolbar: [
        ['link', 'image', 'video'],
        ['clean']
    ],
    imageDrop: true,
};

const storage = getStorage();
async function uploadImage(file) {
    // ファイル名を生成する。ここでは簡単のためにタイムスタンプを使用していますが、
    // 実際の用途に応じて適切な名前付け戦略を選択してください。
    const timestamp = Date.now();
    const fileName = `images/${timestamp}.png`; // 例: 'images/1629354820123.png'

    const storageRef = ref(storage, fileName); // これで子の参照を作成しています。
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


function MyEditor({ id, content, onContentChange, dbCollection }) {
    const [editorHtml, setEditorHtml] = useState(content || "");
    const quillRef = useRef(null);

    useEffect(() => {
        setEditorHtml(content || "");
    }, [content]);

    const handleImageInsertion = async (imageUrl, placeholderIndex, editor) => {
        editor.deleteText(placeholderIndex, 'アップロード中...'.length);
        editor.insertEmbed(placeholderIndex, 'image', imageUrl);
    };

    const handleImageUpload = async (file, editor) => {
        try {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                const range = editor.getSelection(true);
                editor.insertEmbed(range.index, 'image', imageUrl);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };
    
    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
    
            const handleTextChange = async (delta, oldDelta, source) => {
                if (source !== 'user') return;
    
                delta.ops.forEach(async (op) => {
                    if (op.insert && op.insert.image && op.insert.image.startsWith('data:image/')) {
                        const file = dataURLtoBlob(op.insert.image);
                        handleImageUpload(file, editor);
                    }
                });
            };
    
            return () => {
                editor.off('text-change', handleTextChange);
            };
        }
    }, []);

    useEffect(() => {
        // FirestoreからNOTESを取得
        async function fetchAndSetNotes() {
            const notes = await fetchNotesFromFirestore(dbCollection, id);
            setEditorHtml(notes);
        }
    
        if (id && !content) { // idが存在し、contentが空の場合、Firestoreからデータを取得
            fetchAndSetNotes();
        } else {
            setEditorHtml(content || "");
        }
    }, [id, content, dbCollection]);
    
    

    const debouncedAutoSave = debounce(async (html) => {
        try {
            if (id) {
                const tradeRef = doc(db, dbCollection, id);
                await updateDoc(tradeRef, {
                    NOTES: html,
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
