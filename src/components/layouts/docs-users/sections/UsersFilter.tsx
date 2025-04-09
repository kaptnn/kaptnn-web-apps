"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const UserFilters = () => {
  const router = useRouter();

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : undefined
  );

  const [sort, setSort] = useState(searchParams.get("sort") || "id");
  const [order, setOrder] = useState(searchParams.get("order") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 20);
  const [companyName, setCompanyName] = useState(
    searchParams.get("company_name") || ""
  );

  const [role, setRole] = useState(searchParams.get("role") || "");

  const updateFilters = () => {
    const query = new URLSearchParams();
    query.set("sort", sort);
    query.set("order", order);
    query.set("page", page.toString());
    query.set("limit", limit.toString());
    if (companyName) query.set("company_name", companyName);
    if (role) query.set("role", role);

    router.push(`/dashboard/document/users?${query.toString()}`);
  };

  return (
    <div>
      <input
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        placeholder="Sort field"
      />
      <input
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        placeholder="Order"
      />
      <input
        value={page}
        onChange={(e) => setPage(Number(e.target.value))}
        placeholder="Page"
        type="number"
      />
      <input
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        placeholder="Limit"
        type="number"
      />
      <input
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company name"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
      />
      <button onClick={updateFilters}>Apply Filters</button>
    </div>
  );
};

export default UserFilters;
