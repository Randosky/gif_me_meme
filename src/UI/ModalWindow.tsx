import React, {MutableRefObject, useEffect, useRef} from 'react';
import './StylesUI/ModalWindow.scss'
import MyButton from "./MyButton.tsx";
import {PropsWithChildren} from "react";
import gsap from 'gsap';

interface ModalWindowProps {
    body: React.ReactNode,
    windowContentStyles: string,
    onSubmit?: () => void,
    onClose: () => void,
}

const ModalWindow: React.FC<ModalWindowProps> =
    ({body, onClose, windowContentStyles}: PropsWithChildren<ModalWindowProps>) => {
        let el: MutableRefObject<any> | gsap.core.Timeline = useRef();

        const onKeypress = (e: KeyboardEvent) => e?.key === "Esc" || e.key === "Escape" ? onClose() : null;
        useEffect(() => {
            document.addEventListener('keyup', onKeypress);
            gsap.fromTo('.modal-window', {opacity: 0}, {opacity: 1, duration: 1})

            return () => {
                document.removeEventListener('keyup', onKeypress);
            };
        }, []);

        return (
            <div className="modal-window" onClick={onClose} ref={el}>
                <div className={`modal-window__content ${windowContentStyles}`} onClick={(e) => e.stopPropagation()}>
                    <div className="modal-window__body" children={body}></div>
                    <MyButton
                        btnText="X"
                        btnStyle="close-modal__btn"
                        handleOnClick={() => onClose()}/>
                </div>
            </div>
        );
    };

export default ModalWindow;
