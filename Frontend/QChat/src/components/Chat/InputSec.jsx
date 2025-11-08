import emojy from '../../assets/images/happiness.png'
import send from '../../assets/images/paper-plane.png'


function InputSec({InputValue, setInputValue, ShowEmojy, setShowEmojy, HandleSendWebsocket  }) {
    return (
        <>
            <div className="input-sec flex-jc-start">
                <input
                    type="text"
                    className="chat-input"
                    placeholder='Write a message ...'
                    autoComplete='off'
                    value={InputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                {
                    InputValue && InputValue?.length > 0 ? (
                        <>
                            <div
                                className="emojy-wrapper"
                                onMouseEnter={() => setShowEmojy(true)}
                                onMouseLeave={() => setShowEmojy(false)}
                            >
                                <button
                                    className='chat-send-button flex-center'
                                >
                                    <img src={emojy} className='chat-emojy-icon' />
                                </button>

                                {ShowEmojy && (
                                    <div className="emojy-box">
                                        <div className="emojy-item flex-center" onClick={() => setInputValue(InputValue + '😂')}>😂</div>
                                        <div className="emojy-item flex-center" onClick={() => setInputValue(InputValue + '😐')}>😐</div>
                                        <div className="emojy-item flex-center" onClick={() => setInputValue(InputValue + '😭')}>😭</div>
                                    </div>
                                )}
                            </div>
                            <button
                                className='chat-send-button flex-center'
                                onClick={HandleSendWebsocket}
                            >
                                <img src={send} className='chat-send-icon' />
                            </button>
                        </>
                    ) : (
                        <>
                            <div
                                className="emojy-wrapper"
                                onMouseEnter={() => setShowEmojy(true)}
                                onMouseLeave={() => setShowEmojy(false)}
                            >
                                <button
                                    className='chat-send-button flex-center'
                                >
                                    <img src={emojy} className='chat-emojy-icon' />
                                </button>

                                {ShowEmojy && (
                                    <div className="emojy-box">
                                        <div className="emojy-item flex-center" onClick={() => setInputValue(InputValue + '😂')}>😂</div>
                                        <div className="emojy-item flex-center" onClick={() => setInputValue(InputValue + '😐')}>😐</div>
                                        <div className="emojy-item flex-center" onClick={() => setInputValue(InputValue + '😭')}>😭</div>
                                    </div>
                                )}
                            </div>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default InputSec