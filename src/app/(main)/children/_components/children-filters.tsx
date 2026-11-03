"use client";

import { SearchIcon } from "lucide-react";
import { useId } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ClubOption = {
  id: string;
  name: string;
};

type GroupOption = {
  id: string;
  name: string;
  club_name: string;
};

interface ChildrenFiltersProps {
  clubs: ClubOption[];
  groups: GroupOption[];
  selectedClubId: string;
  selectedGroupId: string;
  searchValue: string;
  showGroupFilters: boolean;
  onClubChange: (clubId: string) => void;
  onGroupChange: (groupId: string) => void;
  onSearchChange: (value: string) => void;
}

export function ChildrenFilters({
  clubs,
  groups,
  selectedClubId,
  selectedGroupId,
  searchValue,
  showGroupFilters,
  onClubChange,
  onGroupChange,
  onSearchChange,
}: ChildrenFiltersProps) {
  const searchId = useId();
  const clubId = useId();
  const groupId = useId();
  const filteredGroups =
    selectedClubId === "all"
      ? groups
      : groups.filter((g) => {
          const selectedClub = clubs.find((c) => c.id === selectedClubId);
          return selectedClub ? g.club_name === selectedClub.name : false;
        });

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[250px]">
        <label
          htmlFor={searchId}
          className="text-sm font-medium text-muted-foreground"
        >
          Buscar
        </label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id={searchId}
            placeholder="Buscar por nombre..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {showGroupFilters && (
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[200px]">
          <label
            htmlFor={clubId}
            className="text-sm font-medium text-muted-foreground"
          >
            Club
          </label>
          <Select value={selectedClubId} onValueChange={onClubChange}>
            <SelectTrigger id={clubId} className="w-full">
              <SelectValue placeholder="Seleccionar club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los clubes</SelectItem>
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showGroupFilters && (
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[200px]">
          <label
            htmlFor={groupId}
            className="text-sm font-medium text-muted-foreground"
          >
            Grupo
          </label>
          <Select value={selectedGroupId} onValueChange={onGroupChange}>
            <SelectTrigger id={groupId} className="w-full">
              <SelectValue placeholder="Seleccionar grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los grupos</SelectItem>
              {filteredGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}{" "}
                  <span className="text-muted-foreground">
                    ({group.club_name})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
