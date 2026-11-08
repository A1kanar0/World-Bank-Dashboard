import { Link, useNavigate } from "react-router";
import { formatGdp } from "../../utils/formatters";

export default function CountryTable({ countries }) {
    const navigate = useNavigate();

    const detailsPath = (country) => `/country/${country.id}?year=${country.date}`;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
                <thead className="text-gray-400 dark:text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                    <th className="pb-3 px-2">Код (ISO)</th>
                    <th className="pb-3 px-2">Країна</th>
                    <th className="pb-3 px-2">Рік</th>
                    <th className="pb-3 px-2 text-right">Показник (ВВП USD)</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {countries.map((country) => (
                    <tr
                        key={country.id}
                        tabIndex={0}
                        onClick={() => navigate(detailsPath(country))}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") navigate(detailsPath(country));
                        }}
                        className="hover:bg-gray-50 dark:hover:bg-[#161927] transition-colors cursor-pointer focus:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-[#161927]"
                    >
                        <td className="py-3 px-2 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                            {country.id}
                        </td>
                        <td className="py-3 px-2 font-semibold text-gray-900 dark:text-white">
                            <Link
                                to={detailsPath(country)}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:underline"
                            >
                                {country.name}
                            </Link>
                        </td>
                        <td className="py-3 px-2 text-gray-500 dark:text-gray-400">
                            {country.date}
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-gray-800 dark:text-gray-200">
                            {formatGdp(country.value)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}