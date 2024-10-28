import React, { useState, useContext } from 'react'
import { assets } from "../../assets/assets"
import "../SideBar/Sidebar.css"
import { Context } from '../../Context/Context';

const SideBar = () => {
    const [extended, setExtended] = useState(false);
    const { onSent, prevPrompt, setRecentPrompt, newChat } = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt)
        await onSent(prompt)
    }

    return (
        <div className='sidebar'>
            <div className='top'>
                <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt='menu-icon' />
                <div onClick={() => newChat()} className='new-chat'>
                    <img src={assets.plus_icon} alt='plus-icon' />
                    {extended ? <p>new chat</p> : null}
                </div>
                {extended ? <div className='recent'>
                    <p className='recent-title'>recent</p>
                    {prevPrompt.map((item, index) => {
                        return (
                            <div onClick={() => loadPrompt(item)} className='recent-entry'>
                                <img src={assets.message_icon} alt='message-icon' />
                                <p>{item.slice(0, 18)} ...</p>
                            </div>
                        )
                    })}

                </div> : null}
            </div>
            <div className='bottom'>
                <div className='bottom-item recent-entry'>
                    <img src={assets.question_icon} alt='help-button' />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className='bottom-item recent-entry'>
                    <img src={assets.history_icon} alt='activity-button' />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className='bottom-item recent-entry'>
                    <img src={assets.setting_icon} alt='settings-button' />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
    )
}

export default SideBar