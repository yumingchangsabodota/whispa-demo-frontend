
import Card from 'react-bootstrap/Card';

function WhispCard(prop){

    const whisp = prop.whisp;

    return(
            <Card border="dark" style={{ width: '60rem' }}>
                <Card.Header>Whisp</Card.Header>
                    <Card.Body>
                        <blockquote className="blockquote mb-0">
                            <p>{whisp.content}</p>
                            <footer className="blockquote-footer">
                                <p>Hash: {whisp.hash}</p>
                                <p>Whisper: {whisp.whisper}</p>
                                <cite>{new Date(whisp.timestamp).toString()}</cite>
                            </footer>
                        </blockquote>
                    </Card.Body>
                </Card>
            )
}

export default WhispCard;