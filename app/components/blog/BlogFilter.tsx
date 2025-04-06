"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface BlogFilterProps {
  options: string[];
  onFilterChange: (value: string) => void;
  currentFilter?: string;
  onReset?: () => void;
}

function BlogFilter({
  options,
  onFilterChange,
  currentFilter = "",
  onReset,
}: BlogFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={onFilterChange} value={currentFilter}>
        <SelectTrigger
          className="w-[180px] focus:ring-primary"
          aria-label="Filtrer par catégorie"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Filtrer par" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Catégories</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option} value={option} className="font-medium">
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {currentFilter && onReset && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="h-9 w-9"
          aria-label="Effacer le filtre"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default BlogFilter;
