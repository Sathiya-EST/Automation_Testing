// import * as React from "react";
// import { format as formatDate, getYear } from "date-fns";
// import { CalendarDays } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// interface DatePickerProps {
//   selectedDate?: Date;
//   onChange: (date: Date | undefined) => void;
//   placeholder?: string;
//   className?: string;
//   format?: string;
//   type?: "date" | "month" | "year";
//   readOnly?: boolean
// }

// const DatePicker: React.FC<DatePickerProps> = ({
//   selectedDate,
//   onChange,
//   placeholder = "Pick a date",
//   className,
//   format,
//   type = "date",
//   readOnly
// }) => {
//   const getDefaultFormat = () => {
//     switch (type) {
//       case "year":
//         return "yyyy";
//       case "month":
//         return "MMMM yyyy";
//       case "date":
//       default:
//         return "yyyy-MM-dd";
//     }
//   };

//   const displayFormat = format || getDefaultFormat();

//   const renderDisplayValue = () => {
//     if (!selectedDate) return <span className="text-slate-400">{placeholder}</span>;
//     return formatDate(selectedDate, displayFormat);
//   };

//   const handleCalendarChange = (date: Date | undefined) => {
//     if (!date) {
//       onChange(undefined);
//       return;
//     }

//     const updatedDate =
//       type === "year"
//         ? new Date(getYear(date), 0, 1)
//         : type === "month"
//           ? new Date(getYear(date), date.getMonth(), 1)
//           : date;

//     onChange(updatedDate);
//   };

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <div >
//           <Button
//             variant="outline"
//             className={cn(
//               "w-full justify-start text-left font-normal",
//               !selectedDate && "text-muted-foreground",
//               className
//             )}
//             aria-label="Open date picker"
//             disabled={readOnly}
//           >
//             <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
//             {renderDisplayValue()}
//           </Button>
//         </div>
//       </PopoverTrigger>
//       {!readOnly && <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           mode="single"
//           selected={selectedDate}
//           onSelect={handleCalendarChange}
//           initialFocus
//         />
//       </PopoverContent>}
//     </Popover>
//   );
// };

// export default DatePicker;

import * as React from "react";
import { format as formatDate, getYear, parse, startOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selectedDate?: Date | string;
  onChange: (date: any) => void;
  placeholder?: string;
  className?: string;
  format?: string;
  type?: "date" | "month" | "year";
  readOnly?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  placeholder = "Pick a date",
  className,
  format,
  type = "date",
  readOnly
}) => {
  const parseDate = (date: Date | string | undefined): Date | undefined => {
    if (!date) return undefined;
    if (date instanceof Date) return startOfDay(date);
    return startOfDay(parse(date, format ? format : "yyyy-MM-dd", new Date()));
  };

  const currentDate = parseDate(selectedDate);

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
    if (!currentDate) return <span className="text-slate-400">{placeholder}</span>;
    return formatDate(currentDate, displayFormat);
  };

  const handleCalendarChange = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }

    const updatedDate = startOfDay(
      type === "year"
        ? new Date(getYear(date), 0, 1)
        : type === "month"
          ? new Date(getYear(date), date.getMonth(), 1)
          : date
    );

    onChange(formatDate(updatedDate, "yyyy-MM-dd"));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !currentDate && "text-muted-foreground",
              className
            )}
            aria-label="Open date picker"
            disabled={readOnly}
          >
            <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
            {renderDisplayValue()}
          </Button>
        </div>
      </PopoverTrigger>
      {!readOnly && (
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleCalendarChange}
            initialFocus
          />
        </PopoverContent>
      )}
    </Popover>
  );
};

export default DatePicker;