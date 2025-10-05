interface TransactionResult {
  message: string;
  transaction_id: string;
  reference_no: string;
  timestamp: string;
}

interface TransactionResultDisplayProps {
  result: TransactionResult;
}

const TransactionResultDisplay = ({ result }: TransactionResultDisplayProps) => {
  return (
    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
      <p className="font-semibold">{result.message}</p>
      <div className="mt-2 text-sm space-y-1">
        <p><span className="font-medium">Transaction ID:</span> {result.transaction_id}</p>
        <p><span className="font-medium">Reference No:</span> {result.reference_no}</p>
        <p><span className="font-medium">Timestamp:</span> {new Date(result.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TransactionResultDisplay;
