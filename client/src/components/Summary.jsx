const Summary = ({ summary, isSummaryLoading }) => {
    return (

        <div className="fixed bottom-4 right-4 w-1/3 h-1/2 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md text-black overflow-y-auto">
            <p
                className="text-sm font-normal whitespace-pre-line"
                dangerouslySetInnerHTML={{
                    __html: summary.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                }}
            />
        </div>
    );
};

export default Summary;
