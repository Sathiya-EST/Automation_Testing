import * as React from "react";
import { format as formatDate, getYear } from "date-fns";
import { CalendarDays, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import TimePicker from "./TimePicker";

interface DateTimePickerProps {
    selectedDateTime?: string; // Expecting string for selectedDateTime
    onChange: (date: string | undefined) => void; // Expecting a string as the updated date
    placeholder?: string;
    className?: string;
    format?: string;
    type?: "date" | "month" | "year" | "datetime" | "time";
    timeFormat?: 12 | 24;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    selectedDateTime,
    onChange,
    placeholder = "Pick a date and time",
    className,
    format,
    type = "datetime",
    timeFormat=12
}) => {
    const getDefaultFormat = () => {
        switch (type) {
            case "year":
                return "yyyy";
            case "month":
                return "MMMM yyyy";
            case "time":
                return "HH:mm";
            case "datetime":
                return "yyyy-MM-dd HH:mm";
            case "date":
            default:
                return "yyyy-MM-dd";
        }
    };

    const displayFormat = format || getDefaultFormat();

    const renderDisplayValue = () => {
        if (!selectedDateTime) return <span className="text-slate-400">{placeholder}</span>;
        return formatDate(new Date(selectedDateTime), displayFormat);
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

        onChange(formatDate(updatedDate, displayFormat)); 
    };

    const handleTimeChange = (time: string) => {
        if (time && selectedDateTime) {
            const updatedDateTime = new Date(selectedDateTime);
            const [hours, minutes] = time.split(":").map(Number);

            updatedDateTime.setHours(hours);
            updatedDateTime.setMinutes(minutes);

            onChange(formatDate(updatedDateTime, displayFormat));
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDateTime && "text-muted-foreground",
                        className
                    )}
                    aria-label="Open date and time picker"
                >
                    <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                    {renderDisplayValue()}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                {type === "time" && (
                    <TimePicker
                        value={selectedDateTime ? selectedDateTime.slice(-5) : ''}
                        onChange={handleTimeChange}
                        format={timeFormat}
                    />
                )}
                {type === "datetime" && (
                    <div className="flex flex-col space-y-4 justify-center items-center w-full">
                        <Calendar
                            mode="single"
                            selected={selectedDateTime ? new Date(selectedDateTime) : undefined}
                            onSelect={handleCalendarChange}
                            initialFocus
                        />
                        <div className="w-full flex justify-center pb-1">
                            <TimePicker
                        value={selectedDateTime ? selectedDateTime.slice(-5) : ''}
                        onChange={handleTimeChange}
                                format={timeFormat}
                            />
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default DateTimePicker;
