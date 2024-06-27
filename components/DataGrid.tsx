"use client";
import { DataCard } from "@/components/DataCard";
import { countTransactionCategories } from "@/lib/utils";

export const DataGrid = ({ transactions }: DataGridProps) => {
    const categories: CategoryCount[] = countTransactionCategories(transactions);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            {categories.map((category, index) => (
                <DataCard
                    key={category.name}
                    category={category}
                />
            ))}
        </div>
    )
}