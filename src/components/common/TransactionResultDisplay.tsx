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
    <div className="bg-[#38B000] bg-opacity-10 border border-[#38B000] text-[#264653] px-5 py-4 rounded-lg shadow-sm">
      <p className="font-semibold text-lg">{result.message}</p>
      <div className="mt-3 space-y-2">
        <p><span className="font-medium text-[#2A9D8F]">Transaction ID:</span> {result.transaction_id}</p>
        <p><span className="font-medium text-[#2A9D8F]">Reference No:</span> {result.reference_no}</p>
        <p><span className="font-medium text-[#2A9D8F]">Timestamp:</span> {new Date(result.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TransactionResultDisplay;
