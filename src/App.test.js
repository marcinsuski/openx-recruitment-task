import { render, screen } from "@testing-library/react";
import App from "./App";
import { act } from "react-dom/test-utils";
import { findUsersWithGreatestDistance } from "./App";

describe.skip("fetchData function", () => {
    test("should fetch data from three different endpoints", async () => {
        global.fetch = jest.fn();
        const fakeData = [
            { id: 1, name: "user1" },
            { id: 2, name: "user2" },
            { id: 1, price: 10 },
            { id: 2, price: 20 },
        ];
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(fakeData.slice(0, 2)),
            })
        );
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(fakeData.slice(2, 4)),
            })
        );
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(fakeData.slice(2, 4)),
            })
        );
        act(() => {
            render(<App />);
        });
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});

describe.skip("findUsersWithGreatestDistance function", () => {
    test("should find the two users living furthest away from each other", () => {
        const users = [
            {
                id: 1,
                name: { firstname: "John", lastname: "Doe" },
                address: { geolocation: { lat: 51.5074, long: 0.1278 } },
            },
            {
                id: 2,
                name: { firstname: "Jane", lastname: "Doe" },
                address: { geolocation: { lat: 40.7128, long: -74.006 } },
            },
        ];
        act(() => {
            render(<App />);
        });
        const [user1, user2, distance] = findUsersWithGreatestDistance(users);
        expect(user1.name.firstname).toBe("John");
        expect(user2.name.firstname).toBe("Jane");
        expect(distance).toBe("5587.01");
    });
});

describe("productValueByCategory object", () => {
    test("should find the total value of products from each category", () => {
        const products = [
            { id: 1, category: "electronics", price: 10 },
            { id: 2, category: "books", price: 20 },
            { id: 3, category: "electronics", price: 30 },
        ];
        const productValueByCategory = {};
        for (const product of products) {
            const { category, price } = product;
            if (!productValueByCategory[category]) {
                productValueByCategory[category] = price;
            } else {
                productValueByCategory[category] += price;
            }
        }
        expect(productValueByCategory["electronics"]).toBe(40);
        expect(productValueByCategory["books"]).toBe(20);
    });
});
