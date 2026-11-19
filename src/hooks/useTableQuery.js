import { useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

/**
 * Custom router adapter providing Next.js-like router.push() and router.replace()
 * in React Router v7.
 */
export const useRouter = () => {
  const navigate = useNavigate();
  return useMemo(
    () => ({
      push: (targetUrl, options) => navigate(targetUrl, options),
      replace: (targetUrl, options) =>
        navigate(targetUrl, { ...options, replace: true }),
    }),
    [navigate]
  );
};

function areObjectsEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

/**
 * Hook to manage persisting and synchronizing pagination, search, and filters
 * in URL search parameters without unnecessary renders or navigation loops.
 *
 * @param {Object} options
 * @param {Object} options.defaultValues - Default query values, e.g. { page: 1, search: "", status: "all" }
 * @param {string} [options.searchKey="search"] - URL search param key for search query (e.g. "search" or "name")
 */
export function useTableQuery({ defaultValues = {}, searchKey = "search" } = {}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Stabilize defaultValues reference across re-renders
  const defaultValuesRef = useRef(defaultValues);
  if (!areObjectsEqual(defaultValuesRef.current, defaultValues)) {
    defaultValuesRef.current = defaultValues;
  }
  const stableDefaults = defaultValuesRef.current;

  const router = useMemo(
    () => ({
      push: (targetUrl, options) => navigate(targetUrl, options),
      replace: (targetUrl, options) =>
        navigate(targetUrl, { ...options, replace: true }),
    }),
    [navigate]
  );

  // Parse current query values from URL search params
  const query = useMemo(() => {
    const values = { ...stableDefaults };

    // 1. Parse page (must be integer >= 1)
    const pageParam = searchParams.get("page");
    if (pageParam !== null) {
      const parsed = parseInt(pageParam, 10);
      values.page = Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
    } else {
      values.page = stableDefaults.page ?? 1;
    }

    // 2. Parse search
    const searchParam = searchParams.get(searchKey);
    if (searchParam !== null) {
      values[searchKey] = searchParam;
      if (searchKey !== "search") {
        values.search = searchParam;
      }
    } else {
      values[searchKey] = stableDefaults[searchKey] ?? stableDefaults.search ?? "";
      values.search = values[searchKey];
    }

    // 3. Parse all other custom filter keys
    Object.keys(stableDefaults).forEach((key) => {
      if (key === "page" || key === searchKey || key === "search") return;
      const paramVal = searchParams.get(key);
      if (paramVal !== null) {
        values[key] = paramVal;
      } else {
        values[key] = stableDefaults[key];
      }
    });

    return values;
  }, [searchParams, stableDefaults, searchKey]);

  // Update query parameters in URL
  const updateQuery = useCallback(
    (updates, opts = {}) => {
      const currentParams = new URLSearchParams(location.search);
      const shouldResetPage = opts.resetPage ?? true;

      // When filters or search change without explicit page, reset page to 1
      if (shouldResetPage && !("page" in updates)) {
        currentParams.delete("page");
      }

      Object.entries(updates).forEach(([key, val]) => {
        if (key === "page") {
          const pageNum = parseInt(val, 10);
          if (Number.isFinite(pageNum) && pageNum > 1) {
            currentParams.set("page", String(pageNum));
          } else {
            currentParams.delete("page");
          }
        } else if (key === searchKey || key === "search") {
          const actualKey = searchKey;
          const searchStr = String(val ?? "").trim();
          if (searchStr) {
            currentParams.set(actualKey, searchStr);
          } else {
            currentParams.delete(actualKey);
          }
        } else {
          const defaultVal = stableDefaults[key];
          if (
            val === undefined ||
            val === null ||
            val === "" ||
            val === "all" ||
            val === "All" ||
            val === defaultVal
          ) {
            currentParams.delete(key);
          } else {
            currentParams.set(key, String(val));
          }
        }
      });

      // Avoid unnecessary router navigation when params haven't actually changed
      currentParams.sort();
      const existingParams = new URLSearchParams(location.search);
      existingParams.sort();

      if (currentParams.toString() === existingParams.toString()) {
        return;
      }

      const queryString = currentParams.toString();
      const targetUrl = queryString
        ? `${location.pathname}?${queryString}`
        : location.pathname;

      if (opts.replace) {
        router.replace(targetUrl);
      } else {
        router.push(targetUrl);
      }
    },
    [location.pathname, location.search, stableDefaults, searchKey, router]
  );

  const setPage = useCallback(
    (page, opts = {}) => {
      updateQuery({ page }, { resetPage: false, ...opts });
    },
    [updateQuery]
  );

  const setSearch = useCallback(
    (searchVal, opts = {}) => {
      updateQuery({ [searchKey]: searchVal }, { resetPage: true, ...opts });
    },
    [updateQuery, searchKey]
  );

  const setFilter = useCallback(
    (key, val, opts = {}) => {
      updateQuery({ [key]: val }, { resetPage: true, ...opts });
    },
    [updateQuery]
  );

  return {
    query,
    setPage,
    setSearch,
    setFilter,
    updateQuery,
    router,
    searchParams,
  };
}
