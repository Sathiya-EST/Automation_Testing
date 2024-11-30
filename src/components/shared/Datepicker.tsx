import * as React from "react";
import { format as formatDate, getYear } from "date-fns";
import { CalendarDays, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selectedDate?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  format?: string;
  type?: "date" | "month" | "year";
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  placeholder = "Pick a date",
  className,
  format,
  type = "date",
}) => {
  const getDefaultFormat = () => {
    switch (type) {
      case "year":
        return "yyyy";
      case "month":
        return "MMMM yyyy";
      case "date":
      default:
        return "yyyy-MM-dd";
    }
  };

  const displayFormat = format || getDefaultFormat();

  const renderDisplayValue = () => {
    if (!selectedDate) return <span className="text-slate-400">{placeholder}</span>;
    return formatDate(selectedDate, displayFormat);
  };

  const handleCalendarChange = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }

    const updatedDate =
      type === "year"
        ? new Date(getYear(date), 0, 1)
        : type === "month"
          ? new Date(getYear(date), date.getMonth(), 1)
          : date;

    onChange(updatedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
          aria-label="Open date picker"
        >
          <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
          {renderDisplayValue()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleCalendarChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
