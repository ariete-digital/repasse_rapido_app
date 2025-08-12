import { useContext } from "react";

import { FiltersContext } from "@contexts/FiltersContext";

export const useFilters = () => {
    const context = useContext(FiltersContext)

    return context
}