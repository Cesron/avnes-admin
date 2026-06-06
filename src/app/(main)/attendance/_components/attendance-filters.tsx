"use client";

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

interface AttendanceFiltersProps {
  clubs: ClubOption[];
  groups: GroupOption[];
  selectedClubId: string;
  selectedGroupId: string;
  onClubChange: (clubId: string) => void;
  onGroupChange: (groupId: string) => void;
}

export function AttendanceFilters({
  clubs,
  groups,
  selectedClubId,
  selectedGroupId,
  onClubChange,
  onGroupChange,
}: AttendanceFiltersProps) {
  // Filter groups based on selected club
  const filteredGroups =
    selectedClubId === "all"
      ? groups
      : groups.filter((g) => {
          // We need to match by club name since we don't have club_id in groups
          const selectedClub = clubs.find((c) => c.id === selectedClubId);
          return selectedClub ? g.club_name === selectedClub.name : false;
        });

  return (
    <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:gap-4">
      <div className="flex flex-col gap-1.5 sm:min-w-[200px]">
        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
          Club
        </label>
        <Select value={selectedClubId} onValueChange={onClubChange}>
          <SelectTrigger className="w-full">
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

      <div className="flex flex-col gap-1.5 sm:min-w-[200px]">
        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
          Grupo
        </label>
        <Select value={selectedGroupId} onValueChange={onGroupChange}>
          <SelectTrigger className="w-full">
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
    </div>
  );
}
