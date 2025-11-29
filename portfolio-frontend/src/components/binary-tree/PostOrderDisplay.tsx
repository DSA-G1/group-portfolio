export default function PostOrderDisplay({ postOrderSeq }: { postOrderSeq: number[] }) {
  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
      <h3 className="text-white font-header text-2xl mb-2">Post Order Traversal</h3>
      <p className="text-[#ffcaef] font-body text-sm mb-4">Left → Right → Root</p>
      <div className="flex gap-3 overflow-auto custom-scrollbar py-2">
        {postOrderSeq.length === 0 && (
          <div className="text-white font-body text-center w-full py-8">
            <div className="text-lg">No Sequence Yet</div>
            <div className="text-sm mt-2">Create a root node to get started</div>
          </div>
        )}
        {postOrderSeq.map((v, i) => (
          <div
            key={i}
            className="min-w-[90px] h-[90px] rounded-full flex items-center justify-center font-body text-white text-2xl font-bold shadow-xl flex-shrink-0 border-[4px] border-white"
            style={{ background: "linear-gradient(135deg, #5170ff 0%, #ff66c4 100%)" }}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}