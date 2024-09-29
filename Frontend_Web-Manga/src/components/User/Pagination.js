import Pagination from 'react-bootstrap/Pagination';

function Paginations() {
    return (
        <Pagination>
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis disabled />

            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item>{14}</Pagination.Item>

            <Pagination.Ellipsis disabled />
            <Pagination.Item>{20}</Pagination.Item>
        </Pagination>
    );
}

export default Paginations;