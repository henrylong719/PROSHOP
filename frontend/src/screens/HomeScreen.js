import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Message from '../components/Message';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  // for pagination
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}

      <h1>
        John your information is already recorded please call Henry to delete it{' '}
      </h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error} </Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              //  the use of Col
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          ></Paginate>
        </>
      )}
    </>
  );
};

export default HomeScreen;

// const [products, setProducts] = useState([]);

//   // make request from back end
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const { data } = await axios.get('/api/products');
//       setProducts(data);
//     };

//     fetchProducts();
//   }, []);
