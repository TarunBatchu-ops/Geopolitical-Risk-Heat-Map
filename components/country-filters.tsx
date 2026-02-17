"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterProps {
  onSearchChange: (value: string) => void
  onRegionChange: (value: string) => void
  onRiskLevelChange: (value: string) => void
  onSortChange: (value: string) => void
}

export function CountryFilters({ onSearchChange, onRegionChange, onRiskLevelChange, onSortChange }: FilterProps) {
  const [search, setSearch] = useState("")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search countries..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select onValueChange={onRegionChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="Africa">Africa</SelectItem>
            <SelectItem value="Americas">Americas</SelectItem>
            <SelectItem value="Asia">Asia</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Oceania">Oceania</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onRiskLevelChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Risk Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onSortChange} defaultValue="risk-desc">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="risk-desc">Highest Risk First</SelectItem>
            <SelectItem value="risk-asc">Lowest Risk First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="stability-asc">Stability (Low to High)</SelectItem>
            <SelectItem value="stability-desc">Stability (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
