import { Clock } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Input } from "../ui/input";

interface TimePickerProps {
    format: 12 | 24;
    value: string;
    onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ format = 12, value, onChange }) => {
    const [hour, setHour] = useState("01");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (value) {
            const [time, periodOrEmpty] = value.split(" ");
            const [h, m] = time.split(":");
            setHour(h);
            setMinute(m);
            setPeriod(periodOrEmpty || "AM");
        }
    }, [value]);

    const handleTimeChange = () => {
        const time = format === 24 ? `${hour}:${minute}` : `${hour}:${minute} ${period}`;
        onChange(time);
    };

    const handleBlur = (value: string, type: "hour" | "minute" | "period") => {
        let formattedValue = value;

        if (type === "hour") {
            if (format === 24) {
                if (!/^[0-9]{1,2}$/.test(value) || Number(value) >= 24 || Number(value) < 0) {
                    formattedValue = "00";
                } else {
                    formattedValue = value.padStart(2, "0");
                }
            } else {
                if (!/^[0-9]{1,2}$/.test(value) || Number(value) > 12 || Number(value) < 1) {
                    formattedValue = "01";
                } else {
                    formattedValue = value.padStart(2, "0");
                }
            }
            setHour(formattedValue);
        }

        if (type === "minute") {
            if (!/^[0-9]{1,2}$/.test(value) || Number(value) > 59 || Number(value) < 0) {
                formattedValue = "00";
            } else {
                formattedValue = value.padStart(2, "0");
            }
            setMinute(formattedValue);
        }

        if (type === "period") {
            if (!/^(AM|PM)$/i.test(value)) {
                formattedValue = "AM";
            } else {
                formattedValue = value.toUpperCase();
            }
            setPeriod(formattedValue);
        }

        handleTimeChange();
    };

    return (
        <div className="relative inline-block text-left">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="px-4 py-2 border rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2  flex items-center"
                    >
                        <Clock className="mr-2 text-foreground" />
                        {`${hour}:${minute} ${format === 24 ? "" : period}`}
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" side="bottom" className="w-64 p-4">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Hour Input */}
                        <div className="flex flex-col items-center">
                            <Input
                                type="text"
                                value={hour}
                                onChange={(e) => setHour(e.target.value)}
                                onBlur={(e) => handleBlur(e.target.value, "hour")}
                                maxLength={2}
                            />
                            <label className="text-xs text-gray-500 mt-1">Hour</label>
                        </div>

                        {/* Minute Input */}
                        <div className="flex flex-col items-center">
                            <Input
                                type="text"
                                value={minute}
                                onChange={(e) => setMinute(e.target.value)}
                                onBlur={(e) => handleBlur(e.target.value, "minute")}
                                maxLength={2}
                            />
                            <label className="text-xs text-gray-500 mt-1">Minute</label>
                        </div>

                        {format !== 24 && (
                            <div className="flex flex-col items-center">
                                <Input
                                    type="text"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    onBlur={(e) => handleBlur(e.target.value, "period")}
                                    maxLength={2}
                                />
                                <label className="text-xs text-gray-500 mt-1">AM/PM</label>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default TimePicker;
