"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Filters(items: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedFilters, setSelectedFilters] = useState({
    country: "",
    locality: "",
    period: "",
    stages: "",
    params: "",
    category: "",
  });

  const handleSelect = useDebouncedCallback((key, value) => {
    console.log(`Filtering... ${key}: ${value}`);

    const newFilters = {
      ...selectedFilters,
      [key]: value === "all" ? "" : value,
    };
    setSelectedFilters(newFilters);

    if (value === "all") {
      value = ""; // Clear the filter
    }

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const filterItems = (items: any, filters: any) => {
    return items.filter((item: any) => {
      return Object.keys(filters).every(
        (key) => !filters[key] || item[key] === filters[key]
      );
    });
  };

  const filteredItems = filterItems(items.items, selectedFilters);

  const uniqueCategories = Array.from(
    new Set(filteredItems.map((item: any) => item.category))
  ).sort((a: any, b) => a.localeCompare(b));

  const uniqueCountries = Array.from(
    new Set(filteredItems.map((item: any) => item.country))
  ).sort((a: any, b) => a.localeCompare(b));

  const uniqueLocality = Array.from(
    new Set(filteredItems.map((item: any) => item.locality))
  ).sort((a: any, b) => a.localeCompare(b));

  const uniquePeriod = Array.from(
    new Set(filteredItems.map((item: any) => item.period))
  ).sort((a: any, b) => a.localeCompare(b));

  const uniqueStages = Array.from(
    new Set(filteredItems.map((item: any) => item.stages))
  ).sort((a: any, b) => a.localeCompare(b));

  const getCount = (key: any, value: any) => {
    return filterItems(items.items, { ...selectedFilters, [key]: value })
      .length;
  };

  return (
    <div className="relative flex flex-1 flex-wrap flex-shrink-0 w-full gap-4 justify-around py-4 px-4">
      <div>
        <Label className="sr-only">Catégories</Label>

        <Select
          onValueChange={(value: string) => handleSelect("category", value)}
        >
          <SelectTrigger className="w-[180px] hover:brightness-125 hover:border hover:border-slate-700 hover:font-bold hover:scale-110 hover:cursor-pointer">
            <SelectValue placeholder="Catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {uniqueCategories.map((category: any) => (
              <SelectItem key={category} value={category}>
                {category} ({getCount("category", category)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="sr-only">Pays</Label>
        <Select
          onValueChange={(value: string) => handleSelect("country", value)}
        >
          <SelectTrigger className="w-[180px] hover:brightness-125 hover:border hover:border-slate-700 hover:font-bold hover:scale-110 hover:cursor-pointer">
            <SelectValue placeholder="Pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {uniqueCountries.map((country: any) => (
              <SelectItem key={country} value={country}>
                {country} ({getCount("country", country)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="sr-only">Localité</Label>
        <Select
          onValueChange={(value: string) => handleSelect("locality", value)}
        >
          <SelectTrigger className="w-[180px] hover:brightness-125 hover:border hover:border-slate-700 hover:font-bold hover:scale-110 hover:cursor-pointer">
            <SelectValue placeholder="Provenances" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {uniqueLocality.map((locality: any) => (
              <SelectItem key={locality} value={locality}>
                {locality} ({getCount("locality", locality)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="sr-only">Eres Géologique</Label>
        <Select
          onValueChange={(value: string) => handleSelect("period", value)}
        >
          <SelectTrigger className="w-[180px] hover:brightness-125 hover:border hover:border-slate-700 hover:font-bold hover:scale-110 hover:cursor-pointer">
            <SelectValue placeholder="Eres Géologique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {uniquePeriod.map((period: any) => (
              <SelectItem key={period} value={period}>
                {period} ({getCount("period", period)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="sr-only">Epoque/Etages</Label>
        <Select
          onValueChange={(value: string) => handleSelect("stages", value)}
        >
          <SelectTrigger className="w-[180px] hover:brightness-125 hover:border hover:border-slate-700 hover:font-bold hover:scale-110 hover:cursor-pointer">
            <SelectValue placeholder="Epoques/Etages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {uniqueStages.map((stages: any) => (
              <SelectItem key={stages} value={stages}>
                {stages} ({getCount("stages", stages)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
