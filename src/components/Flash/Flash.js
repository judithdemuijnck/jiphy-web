import { useEffect, useState } from "react";
import Alert from 'react-bootstrap/Alert';

export default function Flash({ flash }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        flash.message && setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false)
        }, 4000)
    }, [flash.message])

    return (
        isVisible && <Alert variant={flash.type} onClose={() => setIsVisible(false)} dismissible>
            {flash.message}
        </Alert>
    )
}