import { useState } from "react"
import Placeholder from 'react-bootstrap/Placeholder';

export default function ProfileText(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    const handleSubmit = (event, name) => {
        setIsEditing(false)
        setIsLoading(true)
        const data = {}
        data[name] = event.target.value
        props.sendData(name, data)
    }

    const handleInputChange = event => {
        props.setLoggedInUser(prevUserData => {
            prevUserData[event.target.name] = event.target.value;
            return { ...prevUserData }
        })
    }

    const inputField = (name) => {
        if (name === "description") {
            return (
                <textarea
                    autoFocus
                    value={props.loggedInUser[name]}
                    name={name} onChange={evt => handleInputChange(evt)}
                    onBlur={evt => handleSubmit(evt, name)} />
            )
        } else {
            return (
                <input
                    autoFocus
                    type="text"
                    value={props.loggedInUser[name]}
                    name={name}
                    onChange={evt => handleInputChange(evt)}
                    onBlur={evt => handleSubmit(evt, props.name)}
                    placeholder={props.loggedInUser[name]}
                />
            )
        }
    }

    return (
        <div>
            {(isLoading || props.profileIsUploading) && <Placeholder as="p" animation="glow">
                <Placeholder xs={8} />
            </Placeholder>}
            {Object.keys(props.selectedUser).length !== 0 && !props.profileIsUploading && <div className={`profile-section ${props.name}`}>
                {isLoading && setIsLoading(false)}
                {!isEditing && <span>{props.content ? props.content : `no ${props.name}`}</span>}
                {!isEditing && props.isLoggedInUser && <button name={props.name} onClick={() => setIsEditing(true)}
                    className="material-symbols-outlined"> Edit
                </button>}
                {isEditing && props.isLoggedInUser && inputField(props.name)}
            </div>}
        </div >
    )
}