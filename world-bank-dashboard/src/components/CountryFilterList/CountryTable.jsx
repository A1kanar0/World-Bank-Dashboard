import { formatGdp } from "../../utils/formatters";

export default function CountryTable({ countries }) {
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
                        className="hover:bg-gray-50 dark:hover:bg-[#161927] transition-colors"
                    >
                        <td className="py-3 px-2 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                            {country.id}
                        </td>
                        <td className="py-3 px-2 font-semibold text-gray-900 dark:text-white">
                            {country.name}
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