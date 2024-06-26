import { faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchaseProduct, Shirt } from '../apiServices';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/user';
import OrderStatus from './orderStatus';

export default function Home() {
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [dataOrder, setDataOrder] = useState(null);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.user);
    const role = useSelector(state => state.user.role);
    const email = useSelector(state => state.user.email);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupOrder, setShowPopupOrder] = useState(false);
    const popupRef = useRef(null);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchData(searchTerm);
        fetchDataOrder();
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };


    const fetchData = async (searchItem) => {
        setIsLoading(true);
        try {
            const response = await Shirt.get(token, searchItem);
            setData(response.data);
            console.log(response.data);
            setIsLoading(false);
        } catch (error) {
            setError(error);
            setIsLoading(false);
        }
    };

    const fetchDataOrder = async () => {
        setIsLoading(true);
        try {
            console.log(token);
            console.log(email);
            const responseOrder = await PurchaseProduct.getOrder(token, email);
            setDataOrder(responseOrder.data);
            setIsLoading(false);
        } catch (error) {
            setError(error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div>Loading...</div>
            </div>
        );
    }

    const handleItemClick = (index) => {
        setSelectedItem(index);
        if (index === 0) {
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        } else if (index === 1) {
            document.getElementById('product').scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleCart = () => {
        navigate(`/product/cart`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        fetchData(searchTerm);
        const productSection = document.getElementById("product");
        productSection.scrollIntoView({ behavior: "smooth" });
    };

    const handleLogout = () => {
        setShowPopup(false);
        setShowLogoutConfirmation(true);
    };

    const confirmLogout = () => {
        navigate(`/login`);
        dispatch(logout());

    };

    const cancelLogout = () => {
        setShowLogoutConfirmation(false);
    };

    const handleManagement = () => {
        navigate(`/admin/order-management`);
    };

    const handleProductManagement = () => {
        navigate(`/admin/product-management`);
    };

    const handleOrderPlaced = () => {
        setShowPopupOrder(false);
        setShowOrderConfirmation(true);
    };

    const cancelOrder = () => {
        setShowOrderConfirmation(false);
    };

    return (
        <>
            <div className="header_1">
                <div className="header">
                    <div className="logo-container" onClick={() => window.location.href = "http://localhost:3000/product"}>
                        <img className="logo" src="https://img.freepik.com/premium-vector/tshirt-logo-clothing-logo-apparel-store-icon-fashion-logo-design-tshirt-icon-template_657888-112.jpg" alt="Shirt Store Logo" />
                        <span className="store-name">Shirt Store</span>
                    </div>
                    <div className="menu">
                        <ul>
                            <li className={selectedItem === 0 ? 'selected' : ''} onClick={() => handleItemClick(0)}><a href="#home">Home</a></li>
                            <li className={selectedItem === 1 ? 'selected' : ''} onClick={() => handleItemClick(1)}><a href="#product">Product</a></li>
                        </ul>
                    </div>
                    <div className="cart1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="search-input-home"
                        />
                        <FontAwesomeIcon icon={faSearch} className="search-icon-home" onClick={handleSearch} />
                    </div>


                    <div className="cart">
                        <FontAwesomeIcon icon={faShoppingCart} className="search-icon" onClick={() => handleCart()} />
                    </div>

                    <div className="cart">
                        <FontAwesomeIcon icon={faUser} className="search-icon" onClick={togglePopup} />
                        {showPopup && (
                            <div className="popup1" ref={popupRef}>
                                <div className="popup-content1">
                                    <button onClick={handleLogout}>Log out</button>
                                    <button onClick={() => {/* Xử lý thông tin người dùng */ }}>User information</button>
                                    <button onClick={handleOrderPlaced}>Order placed</button>
                                    {role === 1 && (
                                        <div>
                                            <button onClick={handleManagement}>Commodity management</button>
                                            <button onClick={handleProductManagement}>Product management</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showLogoutConfirmation && (
                <div className="logout-confirmation">
                    <p>Are you sure you want to sign out?</p>
                    <button onClick={confirmLogout}>Agree</button>
                    <button onClick={cancelLogout}>Cancel</button>
                </div>
            )}

            {showOrderConfirmation && (
                <div className="order-confirmation">
                    <div style={{ borderBottom: "1px solid #ccc", paddingBottom: '1%', display: 'flex' }}>
                        <div style={{ width: '95%' }}>My order</div>
                        <div onClick={cancelOrder}
                            style={{
                                cursor: 'pointer',
                                border: '1px solid #ccc',
                                padding: '5px',
                                borderRadius: '10px'
                            }}>X</div>
                    </div>

                    <div className="product-list-management1" style={{ border: 'none' }}>
                        <div className="table-container1" style={{ border: 'none', overflow: 'auto', maxHeight: '500px' }}>
                            <div className="table-row1 header-management1" style={{ backgroundColor: "#f2f2f2", fontWeight: "bold", border: 'none' }}>
                                <div className="table-cell1 cell-management1" style={{ width: "5%", textAlign: 'center', border: 'none' }}>STT</div>
                                <div className="table-cell1 cell-management1" style={{ width: "65%", border: 'none' }}>Name</div>
                                <div className="table-cell1 cell-management1" style={{ width: "10%", textAlign: 'center', border: 'none' }}>Price</div>
                                <div className="table-cell1 cell-management1" style={{ width: "20%", textAlign: 'center', border: 'none' }}>Order status</div>
                            </div>
                            {dataOrder && dataOrder?.length > 0 ? (
                                dataOrder?.map((order, index) => (
                                    <div className="table-row1 header-management2" key={index}>
                                        <div className="table-cell1 cell-management1" style={{ width: "5%", textAlign: 'center', border: 'none' }}>{index + 1}</div>
                                        <div className="table-cell1 cell-management1" style={{ width: "65%", border: 'none' }}>{order.name}</div>
                                        <div className="table-cell1 cell-management1" style={{ width: "10%", textAlign: 'center', border: 'none' }}>{order.total}</div>
                                        <div className="table-cell1 cell-management1" style={{ width: "20%", textAlign: 'center', border: 'none' }}> <OrderStatus status={order.status} /></div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data-message">No data available</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="home" id="home">
                <div className='image'>
                    <img className="image_home" src={require("../image/home/1.png")} alt="Shirt Store Logo" />
                </div>

                <div className="image-child">
                    <div className="image_child">
                        <img className="image_one" src={require("../image/home/2.png")} alt="Shirt Store Logo" />
                    </div>
                    <div className="image_child2">
                        <img className="image_two" src={require("../image/home/3.png")} alt="Shirt Store Logo" />
                    </div>
                    <div className="image_child2">
                        <img className="image_two" src={require("../image/home/8.png")} alt="Shirt Store Logo" />
                    </div>
                </div>
            </div>
            <div className="product" id="product">
                <div className='title-product'>
                    Featured Products
                </div>
                <div className="image-product-container">
                    {data?.map((image, index) => (
                        <div className="image-product" key={index}>
                            <a className="product-link" onClick={() => handleProductClick(image?.item1?.id)}>
                                <img className="product-image" src={Shirt.BASEURLIMAGE + image?.item2[0]?.imgPath} alt={image?.item1?.name} />
                                <p className="name" title={image?.item1?.name}>{image?.item1?.name}</p>
                                <p className="price"><b>Price:</b> ${image?.item1?.price}</p>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
            <footer>
                <div className="footer-content1">
                    <h3>code opacity</h3>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo iste corrupti doloribus odio sed!</p>
                    <ul className="socials1">
                        <li><a href="#"><FontAwesomeIcon icon={faFacebook} /></a></li>
                        <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
                        <li><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
                    </ul>
                </div>
                <div className="footer-bottom1">
                    <p>copyright &copy;2024 codeOpacity. designed by <span>TaiTV</span></p>
                </div>
            </footer>

        </>
    );
}
