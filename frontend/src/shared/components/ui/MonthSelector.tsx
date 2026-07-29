type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface MonthSelectorProps {
  month: Month;
  year: number;
  onChange: (month: Month, year: number) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthSelector({
  month,
  year,
  onChange,
}: MonthSelectorProps) {
  const handlePrevious = () => {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange((month - 1) as Month, year);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange((month + 1) as Month, year);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        onClick={handlePrevious}
        aria-label="Previous month"
      >
        &#8249;
      </button>
      <span className="min-w-40 text-center font-semibold">
        {MONTH_NAMES[month - 1]} {year}
      </span>
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        onClick={handleNext}
        aria-label="Next month"
      >
        &#8250;
      </button>
    </div>
  );
}
