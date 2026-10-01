export default function CountryControls({
    regions,
    selectedRegion,
    onRegionChange,
    sortField,
    onSortFieldChange,
    sortOrder,
    onSortOrderChange,
}) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Показники країн
            </h3>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Регіон:</span>
                    <select
                        value={selectedRegion}
                        onChange={(e) => onRegionChange(e.target.value)}
                        className="p-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#121522] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {regions.map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Сортувати:</span>
                    <select
                        value={sortField}
                        onChange={(e) => onSortFieldChange(e.target.value)}
                        className="p-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#121522] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="name">Назва країни</option>
                        <option value="gdp">ВВП</option>
                        <option value="unemployment">Безробіття</option>
                        <option value="lifeExpectancy">Тривалість життя</option>
                    </select>
                </div>

                <button
                    onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-[#121522] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                    {sortOrder === "asc" ? "⬆️ Від меншого" : "⬇️ Від більшого"}
                </button>
            </div>
        </div>
    );
}