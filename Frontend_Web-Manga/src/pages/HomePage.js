import Carousel from 'react-bootstrap/Carousel';
function rdimg() {
    return `https://picsum.photos/2000/800?random=${Math.floor(Math.random() * 1000)}`;
}
function HomePage() {
    return (
        <Carousel>
            <Carousel.Item interval={3500}>
                <img src={rdimg()} className="d-block w-100" alt='img 1' />
                <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={3500}>
                <img src={rdimg()} className="d-block w-100" alt='img 2' />
                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={3500}>
                <img src={rdimg()} className="d-block w-100" alt='img 3' />
                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default HomePage;