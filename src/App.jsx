import React, { useEffect, useState } from "react";
import classes from "./App.module.css";

// TASK 4 - find the 2 users living furthest away from each other
export function findUsersWithGreatestDistance(users) {
    let maxDistance = 0;
    let user1 = null;
    let user2 = null;

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            const lat1 = users[i].address.geolocation.lat;
            const lon1 = users[i].address.geolocation.long;
            const lat2 = users[j].address.geolocation.lat;
            const lon2 = users[j].address.geolocation.long;

            const radius = 6371; // km
            const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
            const φ2 = (lat2 * Math.PI) / 180;
            const Δφ = ((lat2 - lat1) * Math.PI) / 180;
            const Δλ = ((lon2 - lon1) * Math.PI) / 180;

            const a =
                Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) *
                    Math.cos(φ2) *
                    Math.sin(Δλ / 2) *
                    Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = radius * c;

            if (distance > maxDistance) {
                maxDistance = distance;
                user1 = users[i];
                user2 = users[j];
            }
        }
    }
    return [user1, user2, maxDistance.toFixed(2)];
}

function App() {
    const [users, setUsers] = useState([]);
    const [carts, setCarts] = useState([]);
    const [products, setProducts] = useState([]);
    const [mergedData, setMergedData] = useState({});
    const [highestValue, setHighestValue] = useState(0);
    const [highestValueCart, setHighestValueCart] = useState({});

    const userApi = "https://fakestoreapi.com/users";
    const cartApi =
        "https://fakestoreapi.com/carts/?startdate=2019-01-01&enddate=2022-04-07";
    const productsApi = "https://fakestoreapi.com/products";

    // TASK 1 = fetch data from API endpoints
    async function fetchData() {
        const usersResponse = await fetch(userApi);
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const cartsResponse = await fetch(cartApi);
        const cartsData = await cartsResponse.json();
        setCarts(cartsData);

        const productsResponse = await fetch(productsApi);
        const productsData = await productsResponse.json();
        setProducts(productsData);
    }

    // TASK 2 - find total values of products from a given category.
    const productValueByCategory = {};
    for (const product of products) {
        const { category, price } = product;
        if (!productValueByCategory[category]) {
            productValueByCategory[category] = price;
        } else {
            productValueByCategory[category] += price;
        }
    }

    // TASK 3 - data manipulation to easier solve task 3.
    function FindHighestValueCart() {
        const merged = carts.map((cart) => {
            const user = users.find((user) => user.id === cart.userId);
            const mergedProducts = cart.products.map((cartProduct) => {
                const singleProduct = products.find((item) => {
                    return item.id === cartProduct.productId;
                });
                return {
                    ...cartProduct,
                    totalValue: singleProduct.price * cartProduct.quantity,
                };
            });

            return {
                ...cart,
                user,
                products: mergedProducts,
            };
        });
        setMergedData(merged);

        let highestValue = 0;
        let highestValueCart = {};
        if (mergedData.length > 0) {
            for (const cart of mergedData) {
                let cartValue = 0;
                for (const product of cart.products) {
                    cartValue += product.totalValue;
                }
                if (cartValue > highestValue) {
                    highestValue = cartValue;
                    highestValueCart = cart;
                }
                setHighestValue(highestValue);
                setHighestValueCart(highestValueCart);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        FindHighestValueCart();
    }, [products]);

    const farthestUsers = findUsersWithGreatestDistance(users);
    const [user1, user2, maxDistance] = farthestUsers;

    return (
        <div className={classes.App}>
            {/* TASK 1 */}
            <div className={classes.taskOne}>
                <b>TASK 1:</b> FETCH DATA:{" "}
                <div>
                    {users && carts && products ? `✅DONE` : `loading...`}
                </div>
            </div>

            {/* TASK 2 */}
            <div className={classes.taskTwo}>
                <b>TASK 2:</b> PRODUCT CATEGORIES AND TOTAL VALUE:
                <div className={classes.products}>
                    {Object.entries(productValueByCategory).map(
                        ([category, value]) => (
                            <div key={category} className={classes.table}>
                                <div>{category}:</div>
                                <div>${value.toFixed(2)}</div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* TASK 3 */}
            <div className={classes.taskThree}>
                <b>TASK 3:</b> CART WITH THE HIGHEST VALUE, IT'S VALUE AND FULL
                NAME OF IT'S OWNER:
                <div>
                    {highestValue && highestValueCart ? (
                        <>
                            <div>
                                Name:{" "}
                                {highestValueCart.user.name.firstname +
                                    " " +
                                    highestValueCart.user.name.lastname}
                            </div>
                            <div>Value: ${highestValue.toFixed(2)}</div>
                            <div>Cart no: {highestValueCart.id}</div>
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>

            {/* TASK 4 */}
            <div className={classes.taskThree}>
                <b>TASK 4:</b> TWO USERS LIVING FURTHEST AWAY FROM EACH OTHER:
                {user1 && (
                    <div>
                        User1:{" "}
                        {user1.name.firstname + " " + user1.name.lastname}
                    </div>
                )}
                {user2 && (
                    <div>
                        User2:{" "}
                        {user2.name.firstname + " " + user2.name.lastname}
                    </div>
                )}
                {maxDistance && (
                    <div>Distance between the points: {maxDistance} km</div>
                )}
            </div>
        </div>
    );
}

export default App;
