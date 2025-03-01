import React from "react";
import './GroceryPanel.css'
const MDN_URL = "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json";
import { Spinner } from "./Spinner";
import { useState } from "react";
import { groceryFetcher } from "./groceryFetcher";
import { useEffect } from "react";
/**
 * Creates and returns a new promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms the number of milliseconds to delay
 * @returns {Promise<undefined>} a promise that resolves with the value of `undefined` after the specified delay
 */
function delayMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function GroceryPanel(props) {
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null)    
    const [groceryData, setGroceryData] = React.useState([]);

    const [dropdown, setDropdown] = useState("MDN");



    useEffect(() => {
        let isStale = false;
        fetchData(dropdown);
        async function fetchData(url) {

            setGroceryData([]);
            setError(null);
            setIsLoading(true);
            try {
                const response = await groceryFetcher.fetch(url);
                
                isStale && setGroceryData(response);
            } catch (error) {
                isStale && setError(error);
                console.error(`Could not fetch products: ${error}`)
            }

            finally {
                isStale && setIsLoading(false);
            }

        
        }
        isStale = true;

    }, [dropdown])

    function handleDropdownChange(changeEvent) {
        setError(null);
        setDropdown(changeEvent.target.value);
    }


    function handleAddTodoClicked(item, addTask) {
        const todoName = `Buy ${item.name} (${item.price.toFixed(2)})`;
        // TODO complete this
        addTask(todoName);
    }

    return (
        <div className="mt-10">
            <h1 className="text-xl font-bold">Groceries prices today</h1>
            <label className="mb-4 flex gap-4">
                Get prices from:
                <select 
                    className="border border-gray-300 p-1 rounded-sm disabled:opacity-50" 
                    disabled={isLoading}
                    value={dropdown}
                    onChange={(changeEvent) => handleDropdownChange(changeEvent)}
                >
                    <option value="MDN">MDN</option>
                    <option value="Liquor store">Liquor store</option>
                    <option value="Butcher">Butcher</option>
                    <option value="whoknows">Who knows?</option>
                </select>
                {isLoading && <Spinner />}
                {error && <p className="text-red-700 font-bold">Sorry, something went wrong</p>}
            </label>

            {
                groceryData.length > 0 ?
                    <PriceTable items={groceryData} onAddClicked={handleAddTodoClicked} addTask={props.addTask}/> :
                    "No data"
            }
        </div>
    );
}

function PriceTable(props) {
    return (
        <table className="mt-4">
            <thead>
            <tr>
                <th className="text-left">Name</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {
                props.items.map(item =>
                    <PriceTableRow
                        key={item.name}
                        item={item}
                        onAddClicked={() => props.onAddClicked(item, props.addTask)}
                    />
                )
            }
            </tbody>
        </table>
    );
}

function PriceTableRow({item, onAddClicked}) {
    const buttonClasses = `italic px-2 rounded-sm border border-gray-300
        hover:bg-gray-100 active:bg-gray-200 cursor-pointer`;
    return (
        <tr>
            <td>{item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
                <button className={buttonClasses} onClick={onAddClicked}>
                    Add to todos
                </button>
            </td>
        </tr>
    );
}
