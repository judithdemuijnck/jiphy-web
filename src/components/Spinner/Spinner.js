import Loader from 'react-bootstrap/Spinner';

function Spinner() {
    return (
        <Loader animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Loader>
    );
}

export default Spinner;