// ImageNav.jsx
import React, { useContext } from 'react';
import { Paperclip, MagnifyingGlassPlus } from 'phosphor-react';
import { ImageWrapperContext } from '../../contexts/ImageWrapperContext';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ImageNav = ({ selectedRule, setSelectedRule, rules, setRules }) => {
    const { currentImageWrapper } = useContext(ImageWrapperContext);

    const handleSetAsThumbnailClick = async () => {
        if (currentImageWrapper) {
            const img = currentImageWrapper.querySelector('img');
            if (img) {
                // ローカルのrulesを更新
                const updatedRules = rules.map(rule => {
                    if (rule.ID === selectedRule.ID) {
                        return { ...rule, THUMBNAIL: img.src };
                    }
                    return rule;
                });

                // setRulesを使用してローカルのrulesを更新
                setRules(updatedRules);

                // Firestoreへの更新処理
                try {
                    const ruleRef = doc(db, 'rules', selectedRule.ID); // ここでの`selectedRule.ID`は、ruleの一意のIDを想定しています。
                    await updateDoc(ruleRef, { THUMBNAIL: img.src }); // 既存のドキュメントのTHUMBNAILフィールドだけを更新
                } catch (error) {
                    console.error("Error updating rule in Firestore: ", error);
                }
            }
        }
    };
    
    return (
        <div className="editorNav js-imgNav">
            <div className="editorNav__title">menu</div>
            <ul className="editorNav__list">
                <li className="editorNav__item" onClick={handleSetAsThumbnailClick}>
                    <div className="editorNav__icon">
                        <Paperclip className='icon-16'/>
                    </div>
                    <div className="editorNav__desc">Set as thumbnail</div>
                </li>
                <li className="editorNav__item">
                    <div className="editorNav__icon">
                        <MagnifyingGlassPlus className='icon-16'/>
                    </div>
                    <div className="editorNav__desc">Full screen</div>
                </li>
            </ul>
        </div>
    )
}

export default ImageNav
