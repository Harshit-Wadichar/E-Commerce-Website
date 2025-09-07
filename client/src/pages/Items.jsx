import React, { useEffect, useState } from "react";
import { fetchItems } from "../api/api";
import ItemCard from "../components/ItemCard";

// Example categories. In real app, fetch from server or define dynamically.
const CATEGORY_OPTIONS = [
  "All",
  "Electronics",
  "Fashion",
  "Books",
  "Home",
];

export default function Items() {
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("price_asc");

  // Items and loading
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  // Fetch items whenever filters or page change
  useEffect(() => {
    setLoading(true);
    const params = {
      ...(search && { search }),
      ...(category !== "All" && { category }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      sort,
      page,
      limit,
    };
    fetchItems(params).then(res => {
      setItems(res.data.items);
      setTotal(res.data.total);
      setLoading(false);
    });
  }, [search, category, minPrice, maxPrice, sort, page]);

  // Filter bar
  const filterBar = (
    <form
      className="flex flex-col gap-2 md:flex-row md:gap-4 mb-4"
      onSubmit={e => { e.preventDefault(); setPage(1); }}
    >
      <input
        type="text"
        placeholder="Search by title"
        className="border p-2 rounded flex-1"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />
      <select
        className="border p-2 rounded"
        value={category}
        onChange={e => { setCategory(e.target.value); setPage(1); }}
      >
        {CATEGORY_OPTIONS.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min price"
        className="border p-2 rounded w-32"
        value={minPrice}
        min={0}
        onChange={e => { setMinPrice(e.target.value); setPage(1); }}
      />
      <input
        type="number"
        placeholder="Max price"
        className="border p-2 rounded w-32"
        value={maxPrice}
        min={0}
        onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
      />
      <select
        className="border p-2 rounded"
        value={sort}
        onChange={e => { setSort(e.target.value); setPage(1); }}
      >
        <option value="price_asc">Price &#8593;</option>
        <option value="price_desc">Price &#8595;</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
        Filter
      </button>
    </form>
  );

  // Pagination controls
  const totalPages = Math.ceil(total / limit);
  const pagination = (
    <div className="flex justify-center gap-2 mt-4">
      <button
        className="px-3 py-1 bg-gray-200 rounded"
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(1, p - 1))}
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        className="px-3 py-1 bg-gray-200 rounded"
        disabled={page >= totalPages}
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      >
        Next
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Shop Items</h2>
      {filterBar}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.length === 0
              ? <div className="col-span-3 text-center text-gray-500">No items found.</div>
              : items.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
          </div>
          {totalPages > 1 && pagination}
        </>
      )}
    </div>
  );
}