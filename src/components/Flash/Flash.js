import { useEffect, useState } from "react";
import Bus from "../../utils/Bus";
import Alert from 'react-bootstrap/Alert';

export default function Flash() {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        Bus.addListener("flash", ({ message, type }) => {
            setIsVisible(true);
            setMessage(message);
            setType(type);
            setTimeout(() => {
                setIsVisible(false)
            }, 4000)
        })
    }, [])

    return (
        isVisible && <Alert variant={type} onClose={() => setIsVisible(false)} dismissible>
            {message}
        </Alert>
    )
}