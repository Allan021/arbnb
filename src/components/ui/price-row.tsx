type PriceRowProps = {
  label: string;
  value: string;
};

export function PriceRow({ label, value }: PriceRowProps) {
  return (
    <div className="flex justify-between">
      <span className="underline">{label}</span>
      <span>{value}</span>
    </div>
  );
}
